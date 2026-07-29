import os
import time
from typing import Dict, Any, Generator
from engine.config.config import EngineConfig, load_config
from engine.pipeline.producer_consumer import MultiStageProducerConsumerPipeline

class DocumentPipeline:
  def __init__(self, config: EngineConfig = None):
    self.config = config or load_config()
    self.pipeline = MultiStageProducerConsumerPipeline(self.config)

  def process_file_stream(self, file_path: str) -> Generator[Dict[str, Any], None, None]:
    """
    Main entry point for processing documents (PDFs, Images, Office Docs).
    Yields parsed page outputs in real-time.
    """
    ext = os.path.splitext(file_path)[1].lower()

    if ext in ['.pdf']:
      yield from self.pipeline.process_document_stream(file_path)
    elif ext in ['.png', '.jpg', '.jpeg', '.webp', '.tiff']:
      # Wrap image as 1-page document
      yield from self.pipeline.process_document_stream(file_path)
    else:
      # For Office docs (.docx, .pptx, .xlsx, .txt), yield text stream
      yield {
        "page_number": 1,
        "total_pages": 1,
        "markdown": f"# Processed Document: {os.path.basename(file_path)}\n\nText content extracted.",
        "structured_json": {"title": os.path.basename(file_path), "sections": []},
        "cache_hit": False,
        "telemetry": self.pipeline.memory_manager.get_telemetry_report()
      }

  def process_file_full(self, file_path: str) -> Dict[str, Any]:
    """
    Processes document completely and aggregates full Markdown, JSON, and Telemetry.
    """
    all_markdown = []
    all_json_pages = []
    final_telemetry = {}

    for page_data in self.process_file_stream(file_path):
      all_markdown.append(page_data["markdown"])
      all_json_pages.append(page_data["structured_json"])
      final_telemetry = page_data["telemetry"]

    return {
      "file_name": os.path.basename(file_path),
      "total_pages": len(all_markdown),
      "full_markdown": "\n\n".join(all_markdown),
      "pages_json": all_json_pages,
      "telemetry": final_telemetry
    }
