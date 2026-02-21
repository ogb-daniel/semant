import type { IndexEntry } from "../types";

export class VectorStore {
  private entries: IndexEntry[] = [];

  add(entry: IndexEntry) {
    this.entries.push(entry);
  }

  clear() {
    this.entries = [];
  }

  get size() {
    return this.entries.length;
  }

  private dotProduct(a: Float32Array, b: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      sum += a[i]! * b[i]!;
    }
    return sum;
  }

  search(queryVector: Float32Array, topK: number = 10): IndexEntry[] {
    const scored = this.entries.map((entry) => ({
      entry,
      score: this.dotProduct(queryVector, entry.vector),
    }));
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK).map((s) => s.entry);
  }
}
