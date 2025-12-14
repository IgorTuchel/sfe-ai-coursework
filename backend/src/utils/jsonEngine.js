/**
 * @file jsonEngine.js
 * @description Fuzzy matching engine for character JSON scripts.
 * Chooses the best matching script node for a message based on string similarity and probabilities.
 * @module utils/jsonEngine
 */

function lengthSimilarity(str1, str2) {
  if (str1.length < 6 && str2.length < 6) return 1.0;
  const len1 = str1.length;
  const len2 = str2.length;
  return 1 - Math.abs(len1 - len2) / Math.max(len1, len2);
}

function levenshteinDistance(a, b) {
  if (b.length === 0) return a.length;
  if (a.length === 0) return b.length;

  if (a.length < b.length) [a, b] = [b, a];

  if (a.length > 100 || b.length > 100) {
    return Math.max(a.length, b.length);
  }

  let prevRow = [];
  let currentRow = [];

  for (let j = 0; j <= b.length; j++) {
    prevRow[j] = j;
  }

  for (let i = 0; i <= b.length; i++) {
    currentRow[i] = 0;
  }

  for (let i = 1; i <= a.length; i++) {
    currentRow[0] = i;
    for (let j = 1; j <= b.length; j++) {
      if (a.charAt(i - 1) === b.charAt(j - 1)) {
        currentRow[j] = prevRow[j - 1];
      } else {
        currentRow[j] = Math.min(
          prevRow[j] + 1,
          currentRow[j - 1] + 1,
          prevRow[j - 1] + 1
        );
      }
    }

    let temp = prevRow;
    prevRow = currentRow;
    currentRow = temp;
  }

  return prevRow[b.length];
}

/**
 * Returns a response object for the best-matching script node in a JSON script.
 * If no match passes the similarity threshold, returns null.
 * @function getResponseFromJsonScript
 * @param {Array<Object>} jsonScript - Array of script nodes with `triggers`, `responses`, and `options`.
 * @param {string} message - Raw user message to match against triggers.
 * @returns {{text: string, type: string, options: Array<Object>} | null} Selected response and options, or null if no good match.
 */
export function getResponseFromJsonScript(jsonScript, message) {
  const cleanMessage = message
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .trim();

  if (cleanMessage.length > 80) {
    return null;
  }

  let bestMatch = null;
  let highSCore = 0;

  for (const node of jsonScript) {
    if (highSCore >= 1.0) break;
    if (!node.triggers || !node.responses) continue;

    for (const trigger of node.triggers) {
      const cleanTrigger = trigger
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .trim();

      let currentScore = 0;

      if (cleanMessage === cleanTrigger) {
        currentScore = 1.0;
      } else {
        if (lengthSimilarity(cleanMessage, cleanTrigger) >= 0.8) {
          const dist = levenshteinDistance(cleanMessage, cleanTrigger);
          const maxError = Math.floor(cleanTrigger.length * 0.2);

          if (dist <= maxError) {
            currentScore = 1 - dist / cleanTrigger.length;
          }
        }
      }
      if (currentScore > highSCore) {
        highSCore = currentScore;
        bestMatch = node;
      }
    }
  }
  if (bestMatch && highSCore >= 0.8) {
    const totalProbability = bestMatch.responses.reduce(
      (sum, resp) => sum + resp.probability,
      0
    );
    let rand = Math.random() * totalProbability;
    let responseObj = bestMatch.responses[0]; // Default response in case of math problmes
    for (const response of bestMatch.responses) {
      if (rand < response.probability) {
        responseObj = response;
        break;
      }
      rand -= response.probability;
    }
    return {
      text: responseObj.text,
      type: responseObj.type,
      options: bestMatch.options || [],
    };
  }
  return null;
}
