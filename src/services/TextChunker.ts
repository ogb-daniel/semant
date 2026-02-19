export class TextChunker {
  private constructor() {}

  static chunkText(
    content: string,
    chunkSize: number = 500,
    overlap: number = 50,
  ) {
    if (content.length <= chunkSize) {
      return [content];
    }
    const chunks: string[] = [];
    let start = 0;
    while (start < content.length) {
      let end = start + chunkSize;
      if (end < content.length) {
        const lastNewline = content.lastIndexOf(`\n`, end);
        if (lastNewline > start && lastNewline > end - chunkSize * 0.2) {
          end = lastNewline + 1;
        }
      }
      chunks.push(content.slice(start, end));
      if (end >= content.length) {
        break;
      }
      start = Math.max(start + 1, end - overlap);
    }
    return chunks;
  }
}
