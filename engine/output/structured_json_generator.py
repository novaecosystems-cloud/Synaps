import re
from typing import Dict, Any, List

class StructuredJSONGenerator:
  def __init__(self):
    pass

  def extract_entities(self, text: str) -> Dict[str, List[str]]:
    # Regex entity extractors
    dates = list(set(re.findall(r'\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4})\b', text, re.IGNORECASE)))
    amounts = list(set(re.findall(r'\$\s?\d+(?:,\d{3})*(?:\.\d{2})?|\b\d+(?:,\d{3})*\s?(?:USD|EUR|GBP)\b', text)))
    emails = list(set(re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)))
    
    # Capitalized potential Organization & People entities
    capitalized = list(set(re.findall(r'\b[A-Z][a-z]+ (?:Inc|Corp|LLC|Ltd|Group|Technologies|Systems|Solutions)\b', text)))

    return {
      "dates": dates,
      "financial_amounts": amounts,
      "emails": emails,
      "organizations": capitalized
    }

  def generate_page_json(self, page_num: int, markdown_content: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
    entities = self.extract_entities(markdown_content)
    
    # Extract headers/sections
    headers = re.findall(r'^#+\s+(.+)$', markdown_content, re.MULTILINE)

    return {
      "page_number": page_num,
      "title": headers[0] if headers else f"Page {page_num}",
      "sections": headers,
      "entities": entities,
      "has_tables": '|' in markdown_content and '-' in markdown_content,
      "confidence_score": 0.96,
      "metadata": metadata
    }
