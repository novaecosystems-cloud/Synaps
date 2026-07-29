# SYNAPS Local Vision-Language Document Processing Engine

## Architecture Overview

The **SYNAPS Local Vision-Language Document Engine** is designed for processing extremely large, multi-thousand-page enterprise documents while maintaining nearly **constant memory usage**. Inspired by modern Unlimited-OCR paradigms, it combines PyMuPDF high-speed rendering, a SHA-256 visual cache, bounded sliding-window decoding, local GGUF VLM inference (`llama.cpp` / `Ollama`), and structured knowledge extraction.

---

## Document Intelligence Pipeline

```
PDF / Document
      │
      ▼
┌─────────────────────────┐
│  PyMuPDF Page Renderer  │ ──► Multi-threaded (1024x1024 RGB)
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│    Image Optimizer      │ ──► Adaptive Tiling & Contrast Normalization
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Shared Visual Memory   │ ──► SHA-256 Visual Cache Lookup (LRU)
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Bounded-Memory Decoder  │ ──► 128-Token Sliding Window (Constant RAM)
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ VLM Inference Backend   │ ──► llama.cpp GGUF / Ollama (MiniCPM-V, Qwen2-VL)
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   Output Synthesizers   │ ──► GitHub Markdown + Structured JSON
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ SYNAPS Knowledge Bridge │ ──► Company Brain, Knowledge Graph & Decision Memory
└─────────────────────────┘
```

---

## Memory Bounds & Bounded-Window Decoding

Standard document OCR engines suffer from memory inflation because text contexts expand indefinitely as document length increases. SYNAPS solves this with two core mechanisms:

1. **128-Token Sliding-Window Decoder**: Maintains a fixed-size active token window for the VLM decoder, discarding old active tokens from the working memory context while preserving full generated text in persistent output storage.
2. **LRU Visual Memory Cache**: Hashes page images using SHA-256. If identical pages or templates repeat, the visual embedding and parsing results are reused directly from cache without re-running VLM inference.

---

## Enterprise Feature Support

* **Input Formats**: PDF, Scanned PDF, Rotated Pages, Encrypted Files, DOCX, PPTX, XLSX, CSV, Images (PNG, WebP, JPEG, TIFF).
* **Document Types**: Legal Contracts, Financial Reports, Blueprints, Engineering Diagrams, Medical Records, Invoices, Technical Manuals.
* **Hardware Acceleration**: Automatic detection for CUDA, Apple Silicon Metal, and CPU fallback.
