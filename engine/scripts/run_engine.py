import os
import sys
import time

# Add root directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from engine.config.config import load_config
from engine.pipeline.document_pipeline import DocumentPipeline

def main():
  config = load_config()
  print(f"=== SYNAPS Local Vision-Language Engine Initialized ===")
  print(f"• Hardware Acceleration: {config.system.hardware_acceleration.upper()}")
  print(f"• Inference Backend: {config.inference.backend} ({config.inference.model_name})")
  print(f"• Sliding Window Size: {config.memory.sliding_window_tokens} tokens")
  print(f"• Target Resolution: {config.rendering.target_resolution}")

  if len(sys.argv) > 1:
    target_file = sys.argv[1]
    print(f"\nProcessing target document: {target_file}")
    pipeline = DocumentPipeline(config)
    for page in pipeline.process_file_stream(target_file):
      print(f"✓ Parsed Page {page['page_number']}/{page['total_pages']} | RAM: {page['telemetry']['ram_usage_mb']} MB")
  else:
    print("\nUsage: python scripts/run_engine.py <path_to_document.pdf>")

if __name__ == '__main__':
  main()
