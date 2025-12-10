import { getResponseFromJsonScript } from "../utils/jsonEngine.js";

const mockScript = [
  {
    triggers: ["hi", "hello", "hey"],
    responses: [{ text: "Hello there!", type: "text", probability: 1.0 }],
    options: [{ text: "Who are you?", nextNode: "identity" }],
  },
  {
    triggers: ["reset", "restart"],
    responses: [
      { text: "Resetting system...", type: "text", probability: 1.0 },
    ],
    options: [],
  },
  {
    triggers: ["who are you"],
    responses: [{ text: "I am a bot.", type: "text", probability: 1.0 }],
    options: [],
  },
  {
    triggers: ["coin flip"],
    responses: [
      { text: "Heads", type: "text", probability: 0.5 },
      { text: "Tails", type: "text", probability: 0.5 },
    ],
    options: [],
  },
];

describe("JSON Script Engine (Hybrid RAG Mode)", () => {
  // Direct Match Tests
  test("Should match exact triggers regardless of case", () => {
    const result = getResponseFromJsonScript(mockScript, "Hi");
    expect(result).not.toBeNull();
    expect(result.text).toBe("Hello there!");
  });

  test("Should ignore punctuation and extra spaces", () => {
    const result = getResponseFromJsonScript(mockScript, "  Hello!!!  ");
    expect(result).not.toBeNull();
    expect(result.text).toBe("Hello there!");
  });

  test("Should match multi-word triggers exactly", () => {
    const result = getResponseFromJsonScript(mockScript, "Who are you");
    expect(result).not.toBeNull();
    expect(result.text).toBe("I am a bot.");
  });

  // Fuzzy match test
  test("Should correct minor typos (Levenshtein Algo)", () => {
    const result = getResponseFromJsonScript(mockScript, "helo");
    expect(result).not.toBeNull();
    expect(result.text).toBe("Hello there!");
  });

  test("Should correct minor typos with extra spaces", () => {
    const result = getResponseFromJsonScript(mockScript, "  Helloo  ");
    expect(result).not.toBeNull();
    expect(result.text).toBe("Hello there!");
  });

  test("Should correct typos in commands", () => {
    const result = getResponseFromJsonScript(mockScript, "rset");
    expect(result).not.toBeNull();
    expect(result.text).toBe("Resetting system...");
  });

  // Negative Tests for Fuzzy Matching
  test("Should NOT match if typo is too severe", () => {
    const result = getResponseFromJsonScript(mockScript, "res");
    expect(result).toBeNull();
  });

  // Hand off to RAG tests
  test("Should return NULL for sentences containing triggers", () => {
    const result = getResponseFromJsonScript(
      mockScript,
      "I want to reset my account"
    );
    expect(result).toBeNull();
  });

  test("Should return NULL for embedded words", () => {
    const result = getResponseFromJsonScript(mockScript, "him");
    expect(result).toBeNull();
  });

  test("Should return NULL for completely unknown text", () => {
    const result = getResponseFromJsonScript(
      mockScript,
      "What is the capital of France?"
    );
    expect(result).toBeNull();
  });

  test("Should return NULL for very long inputs", () => {
    const longString = "a".repeat(150);
    const result = getResponseFromJsonScript(mockScript, longString);
    expect(result).toBeNull();
  });

  // poroper response structure tests
  test("Should return response with correct structure", () => {
    const result = getResponseFromJsonScript(mockScript, "hello");
    expect(result).toHaveProperty("text");
    expect(result).toHaveProperty("type");
    expect(result).toHaveProperty("options");
  });

  test("Should handle probabilistic responses", () => {
    const result = getResponseFromJsonScript(mockScript, "coin flip");
    expect(result).not.toBeNull();
    expect(["Heads", "Tails"]).toContain(result.text);
  });
});
