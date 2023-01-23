var webpack = require("webpack");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "development",
  entry: ["./src/index.tsx"],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  plugins: [
    new webpack.ProvidePlugin({
      jsx: "./jsx",
      frag: "./frag",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-typescript"],
              plugins: [
                [
                  "@babel/plugin-transform-react-jsx",
                  {
                    pragma: "jsx.jsxPragma",
                    pragmaFrag: "frag.jsxFragmentPragma",
                  },
                ],
              ],
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [new TerserPlugin()],
  },
};
