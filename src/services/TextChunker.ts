export class TextChunker {
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
      const end = start + chunkSize;
      chunks.push(content.slice(start, end));
      if (end >= content.length) {
        break;
      }
      start += chunkSize - overlap;
    }
    return chunks;
  }
}
