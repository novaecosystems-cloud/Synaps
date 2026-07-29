import os
import unittest
from PIL import Image
from engine.config.config import load_config
from engine.rendering.image_optimizer import ImageOptimizer
from engine.memory.shared_visual_memory import SharedVisualMemory
from engine.memory.sliding_window_decoder import SlidingWindowDecoder
from engine.memory.memory_manager import MemoryManager
from engine.output.markdown_generator import MarkdownGenerator
from engine.output.structured_json_generator import StructuredJSONGenerator

class TestVisionLanguageEngine(unittest.TestCase):

  def setUp(self):
    self.config = load_config()

  def test_config_loading(self):
    self.assertIsNotNone(self.config.system.hardware_acceleration)
    self.assertGreater(self.config.memory.sliding_window_tokens, 0)

  def test_image_optimizer(self):
    optimizer = ImageOptimizer(target_resolution=(1024, 1024))
    img = Image.new("RGB", (2000, 3000), (255, 255, 255))
    opt = optimizer.optimize(img)

    self.assertEqual(opt.primary_image.size, (1024, 1024))
    self.assertIsNotNone(opt.image_hash)
    self.assertGreater(len(opt.tiles), 0)

  def test_shared_visual_memory(self):
    memory = SharedVisualMemory(max_entries=10)
    memory.put("p-1", "hash123", None, (1024, 1024), {"vlm_text": "Sample Text"})

    entry = memory.get("hash123")
    self.assertIsNotNone(entry)
    self.assertEqual(entry.page_id, "p-1")
    self.assertGreater(memory.get_hit_ratio(), 0.0)

  def test_sliding_window_decoder(self):
    decoder = SlidingWindowDecoder(window_size=5)
    for word in ["The", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"]:
      decoder.append_token(word + " ")

    active_ctx = decoder.get_active_context()
    self.assertEqual(len(decoder.active_window), 5)
    self.assertIn("lazy", active_ctx)

  def test_markdown_and_json_generators(self):
    md_gen = MarkdownGenerator()
    json_gen = StructuredJSONGenerator()

    raw_text = "# Test Document\n\nContact email@example.com for $15,000 quote."
    repaired_md = md_gen.repair_ocr_formatting(raw_text)
    json_out = json_gen.generate_page_json(1, repaired_md, {})

    self.assertIn("# Test Document", repaired_md)
    self.assertEqual(json_out["page_number"], 1)
    self.assertIn("email@example.com", json_out["entities"]["emails"])

if __name__ == '__main__':
  unittest.main()
