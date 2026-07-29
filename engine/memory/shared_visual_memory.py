import time
from typing import Dict, Any, Optional
from collections import OrderedDict

class VisualCacheEntry:
  def __init__(self, page_id: str, image_hash: str, embedding: Any, resolution: tuple, metadata: Dict[str, Any]):
    self.page_id = page_id
    self.image_hash = image_hash
    self.embedding = embedding
    self.resolution = resolution
    self.metadata = metadata
    self.timestamp = time.time()
    self.hit_count = 0

class SharedVisualMemory:
  def __init__(self, max_entries: int = 500):
    self.max_entries = max_entries
    self.cache: OrderedDict[str, VisualCacheEntry] = OrderedDict()
    self.total_queries = 0
    self.hits = 0

  def get(self, image_hash: str) -> Optional[VisualCacheEntry]:
    self.total_queries += 1
    if image_hash in self.cache:
      self.hits += 1
      entry = self.cache[image_hash]
      entry.hit_count += 1
      # Move to end (LRU)
      self.cache.move_to_end(image_hash)
      return entry
    return None

  def put(self, page_id: str, image_hash: str, embedding: Any, resolution: tuple, metadata: Dict[str, Any]):
    if image_hash in self.cache:
      self.cache.move_to_end(image_hash)
      return

    if len(self.cache) >= self.max_entries:
      # Evict oldest entry (LRU)
      self.cache.popitem(last=False)

    self.cache[image_hash] = VisualCacheEntry(page_id, image_hash, embedding, resolution, metadata)

  def get_hit_ratio(self) -> float:
    if self.total_queries == 0:
      return 0.0
    return round((self.hits / self.total_queries) * 100, 2)

  def clear(self):
    self.cache.clear()
    self.total_queries = 0
    self.hits = 0
