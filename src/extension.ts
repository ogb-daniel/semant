import * as vscode from "vscode";

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
