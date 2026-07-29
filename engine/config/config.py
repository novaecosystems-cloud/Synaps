import os
import yaml
import platform
from pydantic import BaseModel, Field
from typing import List, Tuple

class SystemConfig(BaseModel):
  max_ram_usage_mb: int = 4096
  worker_threads: int = 4
  hardware_acceleration: str = "auto"
  log_level: str = "INFO"

class RenderingConfig(BaseModel):
  target_resolution: List[int] = [1024, 1024]
  dpi: int = 150
  adaptive_tiling: bool = True
  tile_max_dimension: int = 2048
  image_format: str = "WEBP"
  quality: int = 85

class MemoryConfig(BaseModel):
  sliding_window_tokens: int = 128
  max_cache_entries: int = 500
  cache_eviction_strategy: str = "LRU"
  enable_embedding_reuse: bool = True

class InferenceConfig(BaseModel):
  backend: str = "llama_cpp"
  model_name: str = "MiniCPM-V-2_6-GGUF"
  quantization: str = "Q4_K_M"
  llama_cpp_server_url: str = "http://localhost:8080"
  ollama_server_url: str = "http://localhost:11434"
  context_window: int = 4096
  temperature: float = 0.2
  top_p: float = 0.9

class SynapsConfig(BaseModel):
  api_base_url: str = "http://localhost:3000"
  enable_auto_ingestion: bool = True
  enable_knowledge_graph: bool = True
  enable_decision_memory: bool = True

class EngineConfig(BaseModel):
  system: SystemConfig = SystemConfig()
  rendering: RenderingConfig = RenderingConfig()
  memory: MemoryConfig = MemoryConfig()
  inference: InferenceConfig = InferenceConfig()
  synaps: SynapsConfig = SynapsConfig()

def detect_hardware() -> str:
  """
  Automatically detects hardware acceleration available on the system.
  Returns: 'cuda', 'metal', or 'cpu'
  """
  system = platform.system()
  machine = platform.machine()

  # Check Apple Silicon Metal
  if system == 'Darwin' and ('arm' in machine.lower() or 'aarch64' in machine.lower()):
    return 'metal'

  # Check CUDA via environment or PyTorch if available
  try:
    import torch
    if torch.cuda.is_available():
      return 'cuda'
  except ImportError:
    pass

  return 'cpu'

def load_config(config_path: str = None) -> EngineConfig:
  if not config_path:
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    config_path = os.path.join(base_dir, 'config', 'settings.yaml')

  if os.path.exists(config_path):
    with open(config_path, 'r', encoding='utf-8') as f:
      raw = yaml.safe_load(f)
      config = EngineConfig(**raw)
  else:
    config = EngineConfig()

  if config.system.hardware_acceleration == "auto":
    config.system.hardware_acceleration = detect_hardware()

  return config

# Global default config instance
default_config = load_config()
