import * as vscode from "vscode";
import { FileCrawler } from "./services/FileCrawler";
import { TextChunker } from "./services/TextChunker";
import { EmbeddingsService } from "./services/EmbeddingsService";
import { VectorStore } from "./store/VectorStore";
import { SearchTreeProvider } from "./services/SearchTreeProvider";

export function activate(context: vscode.ExtensionContext) {
  console.log("Semantic Search Extension Activated");
  const vectorStore = new VectorStore();
  const provider = new SearchTreeProvider();
  let indexUri: vscode.Uri | undefined;
  if (context.storageUri) {
    vscode.workspace.fs.createDirectory(context.storageUri).then(() => {
       indexUri = vscode.Uri.joinPath(context.storageUri!, "semant-index.json");
       vectorStore.load(indexUri);
    });
  }
  vscode.window.createTreeView("semant-results-view", {
    treeDataProvider: provider,
  });
  const searchCommand = vscode.commands.registerCommand(
    "semant.search",
    async () => {
      if (vectorStore.size === 0) {
        vscode.window.showWarningMessage(
          "No index found. Run 'Reindex Workspace' first.",
        );
        return;
      }
      const query = await vscode.window.showInputBox({
        prompt: "Semantic Search",
        placeHolder: "Search",
      });
      if (!query) return;
      const queryVector = await EmbeddingsService.embed(query);
      const results = vectorStore.search(queryVector, 10);
      const items = results.map((result) => ({
        label: vscode.workspace.asRelativePath(result.filePath),
        description: result.chunk.slice(0, 100).replace(/\n/g, " "),
        filePath: result.filePath,
      }));
      provider.updateResults(results);
      // const selected = await vscode.window.showQuickPick(items, {
      //   placeHolder: `Found ${results.length} results for "${query}"`,
      // });

      // if (selected) {
      //   const doc = await vscode.workspace.openTextDocument(selected.filePath);
      //   await vscode.window.showTextDocument(doc);
      // }
    },
  );
  const reindexCommand = vscode.commands.registerCommand(
    "semant.reindex",
    async () => {
      provider.setIndexingState(true);

      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title:'Semant',
          cancellable: false
        }, 
        async (progress, token)=>{
          progress.report({ message: "Finding files...", increment: 0 });
          vscode.window.showInformationMessage("Indexing...");
      const config = vscode.workspace.getConfiguration("semant");
      const excludePatterns = config.get<string[]>("excludePatterns") || [];
      const excludeGlob =
        excludePatterns.length > 0 ? `{${excludePatterns.join(",")}}` : "";
      const files = await FileCrawler.findFiles(
        "**/*.{ts,tsx,js,jsx,py,java,go,rs,css,scss,html,json,md}",
        excludeGlob,
      );
      console.log(`Found ${files.length} files`);
      const incrementPerFile = files.length > 0 ? 100/files.length : 100
              let processed = 0;

     
      for (const fileUri of files) {
        progress.report({ 
          message: `Indexing file ${processed + 1} of ${files.length}...`, 
          increment: incrementPerFile 
       });
        try {
            const stat = await vscode.workspace.fs.stat(fileUri);
          const currentMtime = stat.mtime;
          const cachedMtime = vectorStore.getLastModified(fileUri.fsPath);
            if (cachedMtime === currentMtime) {
            processed++;
            continue; 
          }
                    vectorStore.removeEntriesForFile(fileUri.fsPath);

          const content = await FileCrawler.readFile(fileUri);
          const chunks = TextChunker.chunkText(content);
          console.log(`Chunked ${fileUri.fsPath} into ${chunks.length} chunks`);
          for (const chunk of chunks) {
            if (chunk.trim().length < 20) continue;

            const vector = await EmbeddingsService.embed(chunk);
            vectorStore.add({ vector, filePath: fileUri.fsPath, chunk , lastModified: currentMtime});
          }
        } catch (error) {
          console.error(`Failed to process ${fileUri.fsPath}`, error);
        }
        processed++;

      }
  if (indexUri) {
         await vectorStore.save(indexUri);
      }
      vscode.window.showInformationMessage(
        `Indexing complete! Processed ${files.length} files`,
      );
        }
      )
   provider.setIndexingState(false);

    },
  );
  const clearCommand = vscode.commands.registerCommand(
    "semant.clearIndex",
    async () => {
      vectorStore.clear();
      provider.clearResults();
      vscode.window.showInformationMessage("Index cleared.");
    },
  );
  context.subscriptions.push(searchCommand, reindexCommand, clearCommand);
}

export function deactivate() {
  console.log("Semantic Search Extension Deactivated");
}
