import gc
import psutil
import time
from typing import Dict, Any

class MemoryTelemetry:
  def __init__(self):
    self.start_time = time.time()
    self.pages_processed = 0
    self.tokens_generated = 0
    self.total_latency_ms = 0.0
    self.peak_latency_ms = 0.0

  def record_page(self, page_latency_ms: float, tokens_count: int):
    self.pages_processed += 1
    self.tokens_generated += tokens_count
    self.total_latency_ms += page_latency_ms
    if page_latency_ms > self.peak_latency_ms:
      self.peak_latency_ms = page_latency_ms

class MemoryManager:
  def __init__(self, max_ram_mb: int = 4096):
    self.max_ram_mb = max_ram_mb
    self.telemetry = MemoryTelemetry()

  def get_ram_usage_mb(self) -> float:
    process = psutil.Process()
    return round(process.memory_info().rss / (1024 * 1024), 2)

  def get_ram_usage_percent(self) -> float:
    return psutil.virtual_memory().percent

  def check_and_reclaim_memory(self):
    """
    Triggers Python garbage collection if RAM exceeds max threshold.
    """
    if self.get_ram_usage_mb() > self.max_ram_mb:
      gc.collect()

  def get_telemetry_report(self, cache_hit_ratio: float = 0.0) -> Dict[str, Any]:
    elapsed = max(0.001, time.time() - self.telemetry.start_time)
    avg_latency = (
      round(self.telemetry.total_latency_ms / max(1, self.telemetry.pages_processed), 2)
      if self.telemetry.pages_processed > 0
      else 0.0
    )

    pages_per_sec = round(self.telemetry.pages_processed / elapsed, 2)
    tokens_per_sec = round(self.telemetry.tokens_generated / elapsed, 2)

    return {
      'ram_usage_mb': self.get_ram_usage_mb(),
      'ram_usage_percent': self.get_ram_usage_percent(),
      'pages_processed': self.telemetry.pages_processed,
      'tokens_generated': self.telemetry.tokens_generated,
      'pages_per_second': pages_per_sec,
      'tokens_per_second': tokens_per_sec,
      'average_latency_ms': avg_latency,
      'peak_latency_ms': round(self.telemetry.peak_latency_ms, 2),
      'embedding_reuse_rate_percent': cache_hit_ratio,
      'elapsed_seconds': round(elapsed, 2)
    }
