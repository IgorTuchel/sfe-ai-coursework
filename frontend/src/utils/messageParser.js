export function parseMessageContent(content) {
  const parts = [];
  const imageRegex = /\[\[CONTENT-IMAGE\]\](.*?)\[\[\/CONTENT-IMAGE\]\]/g;
  const embedRegex = /\[\[CONTENT-EMBED\]\](.*?)\[\[\/CONTENT-EMBED\]\]/g;

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
