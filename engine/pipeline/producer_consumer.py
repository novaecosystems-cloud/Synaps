import queue
import threading
import time
from typing import Dict, Any, Generator
from engine.rendering.pdf_renderer import PDFRenderer, RenderedPage
from engine.rendering.image_optimizer import ImageOptimizer, OptimizedImage
from engine.memory.shared_visual_memory import SharedVisualMemory
from engine.memory.sliding_window_decoder import SlidingWindowDecoder
from engine.memory.memory_manager import MemoryManager
from engine.inference.vlm_engine import VLMEngine
from engine.output.markdown_generator import MarkdownGenerator
from engine.output.structured_json_generator import StructuredJSONGenerator
from engine.synaps_integration.synaps_bridge import SynapsBridge

class PipelineItem:
  def __init__(self, doc_path: str, doc_title: str, page_num: int, total_pages: int):
    self.doc_path = doc_path
    self.doc_title = doc_title
    self.page_num = page_num
    self.total_pages = total_pages
    self.rendered_page: RenderedPage = None
    self.optimized_image: OptimizedImage = None
    self.vlm_text: str = None
    self.markdown: str = None
    self.structured_json: Dict[str, Any] = None
    self.tokens_used: int = 0
    self.cache_hit: bool = False

class MultiStageProducerConsumerPipeline:
  def __init__(self, config):
    self.config = config
    self.renderer = PDFRenderer(
      target_resolution=tuple(config.rendering.target_resolution),
      dpi=config.rendering.dpi,
      max_workers=config.system.worker_threads
    )
    self.optimizer = ImageOptimizer(
      target_resolution=tuple(config.rendering.target_resolution),
      adaptive_tiling=config.rendering.adaptive_tiling
    )
    self.visual_memory = SharedVisualMemory(max_entries=config.memory.max_cache_entries)
    self.sliding_decoder = SlidingWindowDecoder(window_size=config.memory.sliding_window_tokens)
    self.memory_manager = MemoryManager(max_ram_mb=config.system.max_ram_usage_mb)
    self.vlm_engine = VLMEngine(config)
    self.md_generator = MarkdownGenerator()
    self.json_generator = StructuredJSONGenerator()
    self.synaps_bridge = SynapsBridge(config.synaps.api_base_url)

  def process_document_stream(self, doc_path: str) -> Generator[Dict[str, Any], None, None]:
    import fitz
    import os

    if not os.path.exists(doc_path):
      raise FileNotFoundError(f"Document file not found: {doc_path}")

    doc_title = os.path.basename(doc_path)
    doc = fitz.open(doc_path)
    total_pages = len(doc)
    doc.close()

    # Stage 1 & 2: Stream Render Pages
    for page_num, rendered_page in enumerate(self.renderer.stream_render(doc_path), start=1):
      start_page_time = time.time()

      # Stage 3: Optimize Image
      optimized_img = self.optimizer.optimize(rendered_page.image, quality=self.config.rendering.quality)

      # Stage 4: Visual Cache Lookup / Feature Embedding
      cache_entry = self.visual_memory.get(optimized_img.image_hash)
      cache_hit = False

      if cache_entry and self.config.memory.enable_embedding_reuse:
        cache_hit = True
        vlm_text = f"<!-- Reused visual embedding from page {cache_entry.page_id} -->\n" + cache_entry.metadata.get('vlm_text', '')
        tokens_used = 16
      else:
        # Stage 5: VLM Inference
        active_context = self.sliding_decoder.get_active_context()
        vlm_result = self.vlm_engine.process_page_vision(optimized_img.primary_image, page_num, active_context)
        vlm_text = vlm_result.get('text', '')
        tokens_used = vlm_result.get('tokens_used', 64)

        # Store in Visual Memory
        self.visual_memory.put(
          page_id=str(page_num),
          image_hash=optimized_img.image_hash,
          embedding=None,
          resolution=optimized_img.primary_image.size,
          metadata={'vlm_text': vlm_text}
        )

      # Update Sliding Window Tokens (Bounded Memory)
      for token_chunk in vlm_text.split():
        self.sliding_decoder.append_token(token_chunk + " ")

      # Stage 6: Markdown Generation
      markdown_page = self.md_generator.generate_page_markdown(page_num, vlm_text, rendered_page.metadata)

      # Stage 7: Structured JSON Extractor
      json_page = self.json_generator.generate_page_json(page_num, markdown_page, rendered_page.metadata)

      # Stage 8: SYNAPS Memory Bridge
      if self.config.synaps.enable_auto_ingestion:
        self.synaps_bridge.ingest_page_to_company_brain(doc_title, page_num, markdown_page, json_page)

      page_latency_ms = (time.time() - start_page_time) * 1000
      self.memory_manager.telemetry.record_page(page_latency_ms, tokens_used)
      self.memory_manager.check_and_reclaim_memory()

      telemetry_report = self.memory_manager.get_telemetry_report(self.visual_memory.get_hit_ratio())

      yield {
        "page_number": page_num,
        "total_pages": total_pages,
        "markdown": markdown_page,
        "structured_json": json_page,
        "cache_hit": cache_hit,
        "telemetry": telemetry_report
      }
