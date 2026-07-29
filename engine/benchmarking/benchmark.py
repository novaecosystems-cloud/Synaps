import os
import time
from typing import Dict, Any
from engine.pipeline.document_pipeline import DocumentPipeline
from engine.benchmarking.profiler import EngineProfiler

def run_benchmark(pdf_path: str) -> Dict[str, Any]:
  if not os.path.exists(pdf_path):
    raise FileNotFoundError(f"PDF for benchmark not found: {pdf_path}")

  profiler = EngineProfiler()
  pipeline = DocumentPipeline()

  start_time = time.time()
  pages_count = 0
  tokens_count = 0

  for page_data in pipeline.process_file_stream(pdf_path):
    pages_count += 1
    tokens_count += page_data["telemetry"]["tokens_generated"]
    profiler.snapshot()

  total_time = max(0.001, time.time() - start_time)
  summary = profiler.get_summary()

  return {
    "file_path": pdf_path,
    "pages_processed": pages_count,
    "total_tokens": tokens_count,
    "total_time_seconds": round(total_time, 2),
    "pages_per_second": round(pages_count / total_time, 2),
    "tokens_per_second": round(tokens_count / total_time, 2),
    "peak_ram_mb": summary["peak_ram_mb"],
    "final_ram_mb": summary["current_ram_mb"]
  }

if __name__ == '__main__':
  import sys
  if len(sys.argv) > 1:
    res = run_benchmark(sys.argv[1])
    print("\n=== BENCHMARK RESULTS ===")
    for k, v in res.items():
      print(f"• {k}: {v}")
