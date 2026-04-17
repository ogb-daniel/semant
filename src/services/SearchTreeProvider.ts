import * as vscode from "vscode";
import type { IndexEntry } from "../types";

class SearchResultItem extends vscode.TreeItem {
  constructor(entry: IndexEntry) {
    super(
      vscode.workspace.asRelativePath(entry.filePath),
      vscode.TreeItemCollapsibleState.None,
    );
    this.description = entry.chunk.slice(0, 80);
    this.iconPath = new vscode.ThemeIcon("file");
    this.tooltip = entry.chunk;
    this.command = {
      command: "vscode.open",
      title: "Open File",
      arguments: [vscode.Uri.file(entry.filePath)],
    };
  }
}

export class SearchTreeProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  constructor() {}
  private results: SearchResultItem[] = [];
  private isIndexing = false;
  private _onDidChangeTreeData = new vscode.EventEmitter<
    SearchResultItem | undefined | void
  >();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  getTreeItem(
    element: SearchResultItem,
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(
    element?: SearchResultItem | undefined,
  ): vscode.ProviderResult<SearchResultItem[]> {
     if (this.isIndexing) {
      const loader = new vscode.TreeItem("Indexing workspace...", vscode.TreeItemCollapsibleState.None);
      loader.iconPath = new vscode.ThemeIcon("loading~spin"); 
      return [loader];
    }
    
    return this.results;
  }

  updateResults(entries: IndexEntry[]) {
    this.results = entries.map((entry) => new SearchResultItem(entry));
    this._onDidChangeTreeData.fire();
  }

  clearResults() {
    this.results = [];
    this._onDidChangeTreeData.fire();
  }

  setIndexingState(state: boolean) {
    this.isIndexing = state;
    this._onDidChangeTreeData.fire();
  }
}
