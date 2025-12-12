export function parseMessageContent(content) {
  const parts = [];
  const imageRegex = /\[\[CONTENT-IMAGE\]\](.*?)\[\[\/CONTENT-IMAGE\]\]/g;
  const embedRegex = /\[\[CONTENT-EMBED\]\](.*?)\[\[\/CONTENT-EMBED\]\]/g;

  let lastIndex = 0;
  let match;

  // Find all images
  const allMatches = [];
  while ((match = imageRegex.exec(content)) !== null) {
    allMatches.push({
      type: "image",
      index: match.index,
      endIndex: imageRegex.lastIndex,
      url: match[1],
    });
  }

  // Find all embeds
  while ((match = embedRegex.exec(content)) !== null) {
    allMatches.push({
      type: "embed",
      index: match.index,
      endIndex: embedRegex.lastIndex,
      url: match[1],
    });
  }

  // Sort by position
  allMatches.sort((a, b) => a.index - b.index);

  // Build parts array
  allMatches.forEach((item) => {
    // Add text before this match
    if (item.index > lastIndex) {
      const textContent = content.substring(lastIndex, item.index);
      if (textContent.trim()) {
        parts.push({ type: "text", content: textContent });
      }
    }

    // Add the match
    parts.push({ type: item.type, content: item.url });
    lastIndex = item.endIndex;
  });

  // Add remaining text
  if (lastIndex < content.length) {
    const textContent = content.substring(lastIndex);
    if (textContent.trim()) {
      parts.push({ type: "text", content: textContent });
    }
  }

  // If no matches, return plain text
  if (parts.length === 0) {
    parts.push({ type: "text", content });
  }

  return parts;
}
