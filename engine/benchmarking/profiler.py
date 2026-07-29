import time
import psutil
from typing import Dict, Any

class EngineProfiler:
  def __init__(self):
    self.process = psutil.Process()
    self.peak_ram_mb = 0.0
    self.start_time = time.time()

  def snapshot(self):
    ram_mb = self.process.memory_info().rss / (1024 * 1024)
    if ram_mb > self.peak_ram_mb:
      self.peak_ram_mb = ram_mb
    return ram_mb

  def get_summary(self) -> Dict[str, Any]:
    current_ram = self.snapshot()
    elapsed = max(0.001, time.time() - self.start_time)
    return {
      "current_ram_mb": round(current_ram, 2),
      "peak_ram_mb": round(self.peak_ram_mb, 2),
      "elapsed_seconds": round(elapsed, 2)
    }
