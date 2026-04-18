interface CodeChunk {
  content: string;
  filePath: string;
  startLine: number;
  endLine: number;
}

export interface IndexEntry {
  vector: Float32Array;
  filePath: string;
  chunk: string;
  lastModified: number;
}

export interface SerializedIndexEntry {
  vector: number[];
  filePath: string;
  chunk: string;
  lastModified: number;
}