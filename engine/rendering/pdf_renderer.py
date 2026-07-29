import fitz  # PyMuPDF
import io
import os
import time
from typing import Generator, List, Dict, Any, Tuple
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

class RenderedPage:
  def __init__(self, page_num: int, total_pages: int, image: Image.Image, metadata: Dict[str, Any]):
    self.page_num = page_num
    self.total_pages = total_pages
    self.image = image
    self.metadata = metadata
    self.render_time_ms = metadata.get('render_time_ms', 0)

class PDFRenderer:
  def __init__(self, target_resolution: Tuple[int, int] = (1024, 1024), dpi: int = 150, max_workers: int = 4):
    self.target_resolution = target_resolution
    self.dpi = dpi
    self.max_workers = max_workers

  def render_page(self, doc_path: str, page_num: int, total_pages: int, password: str = None) -> RenderedPage:
    start_time = time.time()
    doc = fitz.open(doc_path)

    if doc.is_encrypted and password:
      doc.authenticate(password)

    page = doc.load_page(page_num)

    # Detect rotation and page dimensions
    rotation = page.rotation
    rect = page.rect
    
    # Calculate matrix for rendering to target DPI
    zoom = self.dpi / 72.0
    mat = fitz.Matrix(zoom, zoom)

    pix = page.get_pixmap(matrix=mat, alpha=False)
    
    # Convert Pixmap to PIL Image
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

    render_time = (time.time() - start_time) * 1000

    metadata = {
      'page_num': page_num + 1,
      'total_pages': total_pages,
      'original_width': rect.width,
      'original_height': rect.height,
      'rendered_width': pix.width,
      'rendered_height': pix.height,
      'rotation': rotation,
      'has_text': len(page.get_text('text').strip()) > 0,
      'render_time_ms': round(render_time, 2)
    }

    doc.close()
    return RenderedPage(page_num + 1, total_pages, img, metadata)

  def stream_render(self, doc_path: str, password: str = None) -> Generator[RenderedPage, None, None]:
    """
    Renders PDF pages using a multi-threaded pool without blocking inference.
    Yields pages sequentially as soon as they are rendered.
    """
    if not os.path.exists(doc_path):
      raise FileNotFoundError(f"Document file not found: {doc_path}")

    doc = fitz.open(doc_path)
    total_pages = len(doc)
    doc.close()

    with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
      futures = [
        executor.submit(self.render_page, doc_path, page_idx, total_pages, password)
        for page_idx in range(total_pages)
      ]

      for future in futures:
        yield future.result()
