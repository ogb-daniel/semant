import * as vscode from "vscode";
import { FileCrawler } from "./services/FileCrawler";
import { TextChunker } from "./services/TextChunker";
import { EmbeddingsService } from "./services/EmbeddingsService";

export function activate(context: vscode.ExtensionContext) {
  console.log("Semantic Search Extension Activated");
  const searchCommand = vscode.commands.registerCommand(
    "semant.search",
    async () => {
      vscode.window.showInformationMessage(
        "Semantic Search: Not implemented yet!",
      );
    },
  );
  const reindexCommand = vscode.commands.registerCommand(
    "semant.reindex",
    async () => {
      vscode.window.showInformationMessage("Indexing...");
      const config = vscode.workspace.getConfiguration("semant");
      const excludePatterns = config.get<string[]>("excludePatterns") || [];
      const excludeGlob =
        excludePatterns.length > 0 ? `{${excludePatterns.join(",")}}` : "";
      const files = await FileCrawler.findFiles("**/*", excludeGlob);
      const vectorStore: Array<{
        vector: Float32Array;
        filePath: string;
        chunk: string;
      }> = [];
      console.log(`Found ${files.length} files`);
      for (const fileUri of files) {
        try {
          const content = await FileCrawler.readFile(fileUri);
          const chunks = TextChunker.chunkText(content);
          console.log(`Chunked ${fileUri.fsPath} into ${chunks.length} chunks`);
          for (const chunk of chunks) {
            const vector = await EmbeddingsService.embed(chunk);
            vectorStore.push({ vector, filePath: fileUri.fsPath, chunk });
          }
        } catch (error) {
          console.error(`Failed to process ${fileUri.fsPath}`, error);
        }
      }
      if (vectorStore.length) {
        console.log(vectorStore[0]);
      }
      vscode.window.showInformationMessage(
        `Indexing complete! Processed ${files.length} files`,
      );
    },
  );
  const clearCommand = vscode.commands.registerCommand(
    "semant.clearIndex",
    async () => {
      vscode.window.showInformationMessage("Index cleared.");
    },
  );
  context.subscriptions.push(searchCommand, reindexCommand, clearCommand);
}

export function deactivate() {
  console.log("Semantic Search Extension Deactivated");
}
