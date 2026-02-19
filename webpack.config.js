import path from "path";
import webpack from "webpack";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default {
  mode: "production", // or 'development'
  target: "node", // VS Code extensions run in a Node.js context
  entry: {
    extension: "./src/extension.ts", // Entry point
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].cjs",
    libraryTarget: "commonjs",
    devtoolModuleFilenameTemplate: "../[resource-path]",
  },
  devtool: "source-map",
  externals: {
    vscode: "commonjs vscode", // Exclude vscode API from bundle
  },
  resolve: {
    extensions: [".ts", ".js"],
    fallback: {
      // Polyfills for browser handling if needed, but mostly for clean builds
      fs: false,
      path: false,
      os: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    // Ignore optional dependencies of ONNX runtime that might cause warnings
    new webpack.IgnorePlugin({
      resourceRegExp: /^onnxruntime-node$|^node-gyp$|^sharp$/,
    }),
  ],
};
