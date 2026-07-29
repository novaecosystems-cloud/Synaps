import re
from typing import Dict, Any

class MarkdownGenerator:
  def __init__(self):
    pass

  def repair_ocr_formatting(self, raw_text: str) -> str:
    """
    Detects and repairs common OCR artifacts: hyphenated line-breaks, extra spaces, broken table borders.
    """
    # 1. Join hyphenated words split across lines: "deve-\nlopment" -> "development"
    cleaned = re.sub(r'(\w+)-\n(\w+)', r'\1\2', raw_text)

    # 2. Fix multiple trailing blank lines
    cleaned = re.sub(r'\n{3,}', '\n\n', cleaned)

    # 3. Ensure markdown headings have space after '#'
    cleaned = re.sub(r'^(#+)([A-Za-z0-9])', r'\1 \2', cleaned, flags=re.MULTILINE)

    return cleaned.strip()

  def generate_page_markdown(self, page_num: int, raw_vlm_text: str, metadata: Dict[str, Any]) -> str:
    repaired_text = self.repair_ocr_formatting(raw_vlm_text)
    
    header = f"<!-- PAGE {page_num} START -->\n\n"
    footer = f"\n\n<!-- PAGE {page_num} END -->"

    return f"{header}{repaired_text}{footer}"
