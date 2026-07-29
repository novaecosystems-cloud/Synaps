from abc import ABC, abstractmethod
from typing import Dict, Any
from PIL import Image

class BaseVLMBackend(ABC):
  @abstractmethod
  def generate_page_analysis(self, image: Image.Image, prompt: str, context_tokens: str = "") -> Dict[str, Any]:
    """
    Analyzes page image with vision-language model and returns structured response.
    """
    pass

  @abstractmethod
  def is_available(self) -> bool:
    """
    Checks whether the backend inference engine is online and responsive.
    """
    pass
