<p align="center">
  <img src="public/marketplace-icon.png" width="128" alt="Semant Logo">
</p>

# Semant – AI Semantic Search for VS Code

**Semant** is a blazingly fast, fully-local semantic code search extension for Visual Studio Code. Instead of hunting for exact keyword matches, Semant lets you search your codebase using **meaning and concepts**.

Because Semant uses the ONNX Runtime and `Transformers.js`, the entire AI pipeline runs directly inside your IDE. **Your code never leaves your machine.**

## 🌟 Features

- **Semantic Search**: Search by what the code *does*, not just the variable names. (e.g., searching for "read file to string" will find filesystem buffering code even if those keywords aren't present).
- **100% Local AI**: Powered by HuggingFace's `all-MiniLM-L6-v2` embedding model. No API keys, no subscriptions, no cloud telemetry.
- **Dedicated Sidebar**: Semant integrates beautifully into the VS Code Activity Bar with a custom tree-view interface.
- **Smart Caching**: Semant tracks your file modifications (`mtime`) and only runs the heavy AI embedding models on files that have changed since your last index, making subsequent re-indexes almost instantaneous.

## 🚀 Getting Started

1. Open the **Semantic Search** panel in your Activity Bar (the glowing 'S' icon).
2. Click **Index Workspace** (or the refresh icon). Semant will discover, chunk, and embed your codebase. The first run takes a moment as it downloads the model locally and processes your files.
3. Once the index is complete, click the **Search** icon (🔍) in the panel header.
4. Type your query! The results will instantly appear in the sidebar. Click any result to jump exactly to that chunk of code.

## ⚙️ Configuration

You can customize Semant through your VS Code `settings.json`:

* `semant.excludePatterns`: An array of glob patterns to ignore during indexing. By default, it ignores folder like `node_modules`, `.git`, `dist`, and binary artifacts.
* `semant.model`: The HuggingFace model ID to use for embeddings (Default: `Xenova/all-MiniLM-L6-v2`).

## 🛠️ Building from Source

If you want to tweak Semant or run it locally:

```bash
git clone https://github.com/ogb-daniel/semant
cd semant
npm install
npm run compile
```
Press `F5` in VS Code to open an Extension Development Host.

## 🔒 Privacy

Privacy is a core pillar of Semant. Your source code is run through an embedded `.onnx` model locally on your CPU via WebAssembly. Neither your search queries nor your code are ever transmitted across the internet.

---
**Enjoy semantic searching!**
