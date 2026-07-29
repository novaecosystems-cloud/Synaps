from typing import List

class SlidingWindowDecoder:
  def __init__(self, window_size: int = 128):
    self.window_size = window_size
    self.active_window: List[str] = []
    self.full_history: List[str] = []

  def append_token(self, token: str):
    """
    Appends a new token to the active decoder context window and maintains bounded window size.
    """
    self.full_history.append(token)
    self.active_window.append(token)

    # Enforce sliding window bounds
    if len(self.active_window) > self.window_size:
      self.active_window.pop(0)

  def get_active_context(self) -> str:
    """
    Returns text representation of active sliding window tokens.
    """
    return "".join(self.active_window)

  def get_full_text(self) -> str:
    """
    Returns complete text generated across all processed pages.
    """
    return "".join(self.full_history)

  def reset_window(self):
    """
    Resets active sliding window between major document sections while preserving global text.
    """
    self.active_window.clear()
