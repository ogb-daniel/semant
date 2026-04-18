import { FileCrawler } from "../services/FileCrawler";
import type { IndexEntry, SerializedIndexEntry } from "../types";
import * as vscode from 'vscode'
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

  async save(uri: vscode.Uri){
    const res: SerializedIndexEntry[] = this.entries.map((entry)=> ({...entry, vector: Array.from(entry.vector)}))
    const data = new TextEncoder().encode(JSON.stringify(res))
    await vscode.workspace.fs.writeFile(uri, data)
  }

  async load(uri: vscode.Uri){
try {
      const file = await FileCrawler.readFile(uri)
      const json = JSON.parse(file) as SerializedIndexEntry[]
      this.entries = json.map((entry)=>({...entry, vector: new Float32Array(entry.vector)}))
           console.log(`Loaded ${this.entries.length} chunks from cache.`);
} catch (error) {
        this.entries = [];

}
  }

    getLastModified(filePath: string): number | null {
    const match = this.entries.find(e => e.filePath === filePath);
    return match ? match.lastModified : null;
  }

  removeEntriesForFile(filePath: string) {
    this.entries = this.entries.filter(e => e.filePath !== filePath);
  }

}
