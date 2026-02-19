import * as assert from "assert";
import { TextChunker } from "../services/TextChunker";
suite("TextChunker Test Suite", () => {
  test("Chunking splits text correctly", () => {
    const text = "1234567890";
    const chunks = TextChunker.chunkText(text, 4, 1);
    assert.deepStrictEqual(chunks, ["1234", "4567", "7890"]);
  });
  test("Chunking handles text smaller than chunk size", () => {
    const text = "Small text";
    const chunks = TextChunker.chunkText(text, 100, 10);
    assert.deepStrictEqual(chunks, ["Small text"]);
  });
  test("Chunking respects overlap", () => {
    const text = "The quick brown fox jumps over the lazy dog";
    const chunks = TextChunker.chunkText(text, 20, 5);
    for (let i = 0; i < chunks.length - 1; i++) {
      const currentChunk = chunks[i];
      const nextChunk = chunks[i + 1];
      const overlap = currentChunk.slice(-5);
      assert.ok(
        nextChunk.includes(overlap),
        `Next chunk should contain end of previous chunk: "${overlap}"`,
      );
    }
  });
});
