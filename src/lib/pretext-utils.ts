import { prepare, layout } from 'pretext';

/**
 * Fast off-screen text layout measurement using pretext arithmetic
 * avoids forced synchronous DOM reflows during streaming AI response rendering.
 */
export function measureTextHeight(
  text: string,
  containerWidth: number,
  font: string = '14px Sora, sans-serif',
  lineHeight: number = 22
): number {
  if (!text || containerWidth <= 0) return 0;
  
  try {
    // Prepare text segments with Intl.Segmenter word boundaries & Canvas.measureText
    const preparedText = prepare(text, font);
    // Calculate off-screen multiline line count arithmetic
    const lineCount = layout(preparedText, containerWidth);
    return Math.max(1, lineCount) * lineHeight;
  } catch (error) {
    // Fallback calculation if canvas/Intl is unavailable
    const charsPerLine = Math.max(1, Math.floor(containerWidth / 8.5));
    const estimatedLines = Math.ceil(text.length / charsPerLine);
    return estimatedLines * lineHeight;
  }
}
