import argparse
import sys
import json
from engine.pipeline.document_pipeline import DocumentPipeline

def main():
  parser = argparse.ArgumentParser(description="SYNAPS Unlimited Vision-Language Document Engine CLI")
  subparsers = parser.add_subparsers(dest="command", help="Sub-commands")

  # Process command
  process_parser = subparsers.add_parser("process", help="Process document")
  process_parser.add_argument("file_path", help="Path to PDF or document file")
  process_parser.add_argument("--stream", action="store_true", help="Stream pages in real-time")
  process_parser.add_argument("--export-json", help="Save structured JSON to file")
  process_parser.add_argument("--export-md", help="Save markdown output to file")

  args = parser.parse_args()

  if args.command == "process":
    pipeline = DocumentPipeline()

    if args.stream:
      print(f"=== Processing Document Stream: {args.file_path} ===")
      for page in pipeline.process_file_stream(args.file_path):
        print(f"\n--- PAGE {page['page_number']}/{page['total_pages']} ---")
        print(page['markdown'])
        print(f"[Telemetry: RAM {page['telemetry']['ram_usage_mb']} MB | Cache Hit Rate: {page['telemetry']['embedding_reuse_rate_percent']}%]")
    else:
      result = pipeline.process_file_full(args.file_path)
      print(f"Successfully processed {result['total_pages']} pages.")
      print(f"Peak RAM: {result['telemetry']['ram_usage_mb']} MB")

      if args.export_md:
        with open(args.export_md, 'w', encoding='utf-8') as f:
          f.write(result['full_markdown'])
        print(f"Saved Markdown to {args.export_md}")

      if args.export_json:
        with open(args.export_json, 'w', encoding='utf-8') as f:
          json.dump(result['pages_json'], f, indent=2)
        print(f"Saved Structured JSON to {args.export_json}")
  else:
    parser.print_help()

if __name__ == '__main__':
  main()
