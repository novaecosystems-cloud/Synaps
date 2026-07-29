import requests
from typing import Dict, Any

class SynapsBridge:
  def __init__(self, api_base_url: str = "http://localhost:3000"):
    self.api_base_url = api_base_url.rstrip('/')

  def ingest_page_to_company_brain(self, doc_title: str, page_num: int, markdown_chunk: str, json_chunk: Dict[str, Any]) -> bool:
    """
    Ingests parsed page knowledge directly into SYNAPS Company Brain & Knowledge Graph APIs.
    """
    payload = {
      "docTitle": doc_title,
      "pageNum": page_num,
      "markdown": markdown_chunk,
      "structuredData": json_chunk,
      "entities": json_chunk.get("entities", {}),
      "sections": json_chunk.get("sections", [])
    }

    try:
      # POST to SYNAPS Graph RAG ingestion API
      res = requests.post(f"{self.api_base_url}/api/graph", json=payload, timeout=5)
      return res.status_code in [200, 201]
    except Exception:
      # If Next.js dev server is offline during standalone Python processing
      return False
