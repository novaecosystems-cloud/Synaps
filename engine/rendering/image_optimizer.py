import io
import hashlib
from typing import Tuple, List, Dict, Any
from PIL import Image, ImageEnhance, ImageOps

class OptimizedImage:
  def __init__(self, primary_image: Image.Image, tiles: List[Image.Image], image_hash: str, metadata: Dict[str, Any]):
    self.primary_image = primary_image
    self.tiles = tiles
    self.image_hash = image_hash
    self.metadata = metadata

class ImageOptimizer:
  def __init__(self, target_resolution: Tuple[int, int] = (1024, 1024), adaptive_tiling: bool = True, tile_max_dim: int = 2048):
    self.target_resolution = target_resolution
    self.adaptive_tiling = adaptive_tiling
    self.tile_max_dim = tile_max_dim

  def compute_image_hash(self, img: Image.Image) -> str:
    buf = io.BytesIO()
    img.save(buf, format='JPEG', quality=50)
    return hashlib.sha256(buf.getvalue()).hexdigest()

  def optimize(self, img: Image.Image, quality: int = 85) -> OptimizedImage:
    # 1. Compute visual SHA-256 hash for caching
    img_hash = self.compute_image_hash(img)

    # 2. Adaptive contrast & normalization for scanned / low-res pages
    img = ImageOps.autocontrast(img, cutoff=1)

    # 3. Generate primary resized image for VLM context
    width, height = img.size
    primary_img = img.copy()
    primary_img.thumbnail(self.target_resolution, Image.Resampling.LANCZOS)

    # Create padded square container if needed
    padded = Image.new("RGB", self.target_resolution, (255, 255, 255))
    offset = ((self.target_resolution[0] - primary_img.width) // 2, (self.target_resolution[1] - primary_img.height) // 2)
    padded.paste(primary_img, offset)

    # 4. Adaptive Tiling for large blueprints or multi-column documents
    tiles = []
    if self.adaptive_tiling and (width > self.tile_max_dim or height > self.tile_max_dim):
      mid_x = width // 2
      mid_y = height // 2
      # Split into 4 quadrants
      q1 = img.crop((0, 0, mid_x, mid_y)).resize(self.target_resolution, Image.Resampling.LANCZOS)
      q2 = img.crop((mid_x, 0, width, mid_y)).resize(self.target_resolution, Image.Resampling.LANCZOS)
      q3 = img.crop((0, mid_y, mid_x, height)).resize(self.target_resolution, Image.Resampling.LANCZOS)
      q4 = img.crop((mid_x, mid_y, width, height)).resize(self.target_resolution, Image.Resampling.LANCZOS)
      tiles = [q1, q2, q3, q4]

    metadata = {
      'original_size': (width, height),
      'optimized_size': padded.size,
      'tile_count': len(tiles),
      'hash': img_hash
    }

    return OptimizedImage(padded, tiles, img_hash, metadata)
