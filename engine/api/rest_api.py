import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
import json
from engine.pipeline.document_pipeline import DocumentPipeline
from engine.config.config import load_config

app = FastAPI(
  title="SYNAPS Local Vision-Language Document Processing Engine",
  description="Constant-memory streaming document intelligence API powered by GGUF VLM & PyMuPDF",
  version="1.0.0"
)

pipeline = DocumentPipeline()

@app.get("/health")
def health_check():
  return {
    "status": "online",
    "engine": "SYNAPS Unlimited VLM Engine",
    "hardware": load_config().system.hardware_acceleration
  }

@app.post("/process")
async def process_document(file: UploadFile = File(...)):
  temp_path = f"temp_{file.filename}"
  with open(temp_path, "wb") as f:
    f.write(await file.read())

  try:
    result = pipeline.process_file_full(temp_path)
    return JSONResponse(content=result)
  finally:
    if os.path.exists(temp_path):
      os.remove(temp_path)

@app.post("/stream")
async def stream_document(file: UploadFile = File(...)):
  temp_path = f"temp_stream_{file.filename}"
  with open(temp_path, "wb") as f:
    f.write(await file.read())

  def generator():
    try:
      for page_data in pipeline.process_file_stream(temp_path):
        yield json.dumps(page_data) + "\n"
    finally:
      if os.path.exists(temp_path):
        os.remove(temp_path)

  return StreamingResponse(generator(), media_type="application/x-ndjson")

if __name__ == '__main__':
  import uvicorn
  uvicorn.run(app, host="0.0.0.0", port=8000)
