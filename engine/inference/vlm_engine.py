from typing import Dict, Any
from PIL import Image
from engine.config.config import EngineConfig
from engine.inference.base_backend import BaseVLMBackend
from engine.inference.llama_cpp_backend import LlamaCppVLMBackend
from engine.inference.ollama_backend import OllamaVLMBackend

class VLMEngine:
  def __init__(self, config: EngineConfig):
    self.config = config
    self.backend: BaseVLMBackend = self._initialize_backend()

  def _initialize_backend(self) -> BaseVLMBackend:
    backend_type = self.config.inference.backend.lower()
    if backend_type == 'ollama':
      return OllamaVLMBackend(
        server_url=self.config.inference.ollama_server_url,
        model_name=self.config.inference.model_name
      )
    else:
      return LlamaCppVLMBackend(
        server_url=self.config.inference.llama_cpp_server_url
      )

  def process_page_vision(self, image: Image.Image, page_num: int, context_tokens: str = "") -> Dict[str, Any]:
    prompt = f"""Transcribe and analyze page {page_num} of this document into clean, GitHub-flavored markdown.
Extract all headings, paragraphs, lists, tables (in markdown format), footnotes, diagrams, and math formulas accurately.
Output ONLY the clean parsed markdown content for page {page_num}."""

    return self.backend.generate_page_analysis(image, prompt, context_tokens)
