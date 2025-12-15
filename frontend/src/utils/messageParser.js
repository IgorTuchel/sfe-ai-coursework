/**
 * @file messageParser.js
 * @description Utility for parsing AI message content with embedded media.
 * Extracts images and embeds from specially formatted content strings and converts
 * them into structured parts for rendering.
 * @module utils/messageParser
 */

/**
 * Parses message content containing embedded images and embeds into structured parts.
 *
 * @param {string} content - The raw message content with embedded media tags.
 * @returns {Array<Object>} Array of content parts for rendering.
 * @returns {string} returns[].type - Part type ("text", "image", or "embed").
 * @returns {string} returns[].content - The content (text string or media URL).
 *
 * @description Parses message content with special delimiter tags:
 * - **Images**: `[[CONTENT-IMAGE]]url[[CONTENT-IMAGE]]`
 * - **Embeds**: `[[CONTENT-EMBED]]url[[CONTENT-EMBED]]`
 *
 * Extracts all media URLs, preserves surrounding text, and returns an ordered array
 * of parts maintaining the original sequence. Empty text sections are omitted.
 *
 * **Parsing behavior**:
 * - Handles multiple images/embeds in single message
 * - Preserves order of mixed text and media
 * - Trims whitespace-only text sections
 * - Returns single text part if no media found
 *
 * @example
 * const content = "Check this out:\n\n[[CONTENT-IMAGE]]https://example.com/image.jpg[[CONTENT-IMAGE]]\n\nAmazing, right?";
 * const parts = parseMessageContent(content);
 * // Returns:
 * // [
 * //   { type: "text", content: "Check this out:" },
 * //   { type: "image", content: "https://example.com/image.jpg" },
 * //   { type: "text", content: "Amazing, right?" }
 * // ]
 *
 * @example
 * // Multiple media types
 * const content = "Text [[CONTENT-IMAGE]]img.jpg[[CONTENT-IMAGE]] more [[CONTENT-EMBED]]video.mp4[[CONTENT-EMBED]] end";
 * const parts = parseMessageContent(content);
 * // Returns array with 5 parts in correct order
 *
 * @example
 * // Plain text (no media)
 * const content = "Just a regular message";
 * const parts = parseMessageContent(content);
 * // Returns: [{ type: "text", content: "Just a regular message" }]
 */
export function parseMessageContent(content) {
  const parts = [];
  const imageRegex = /\[\[CONTENT-IMAGE\]\](.*?)\[\[CONTENT-IMAGE\]\]/g;
  const embedRegex = /\[\[CONTENT-EMBED\]\](.*?)\[\[CONTENT-EMBED\]\]/g;

  let lastIndex = 0;
  let match;

  const allMatches = [];
  while ((match = imageRegex.exec(content)) !== null) {
    allMatches.push({
      type: "image",
      index: match.index,
      endIndex: imageRegex.lastIndex,
      url: match[1],
    });
  }

  while ((match = embedRegex.exec(content)) !== null) {
    allMatches.push({
      type: "embed",
      index: match.index,
      endIndex: embedRegex.lastIndex,
      url: match[1],
    });
  }

  allMatches.sort((a, b) => a.index - b.index);

  allMatches.forEach((item) => {
    if (item.index > lastIndex) {
      const textContent = content.substring(lastIndex, item.index);
      if (textContent.trim()) {
        parts.push({ type: "text", content: textContent });
      }
    }

    parts.push({ type: item.type, content: item.url });
    lastIndex = item.endIndex;
  });

  if (lastIndex < content.length) {
    const textContent = content.substring(lastIndex);
    if (textContent.trim()) {
      parts.push({ type: "text", content: textContent });
    }
  }

  if (parts.length === 0) {
    parts.push({ type: "text", content });
  }

  return parts;
}
