import * as vscode from "vscode";

export class FileCrawler {
  private constructor() {}
  static async findFiles(includePattern: string, excludePattern: string) {
    return await vscode.workspace.findFiles(includePattern, excludePattern);
  }

  static async readFile(uri: vscode.Uri) {
    const bytes = await vscode.workspace.fs.readFile(uri);
    return new TextDecoder().decode(bytes);
  }
}
