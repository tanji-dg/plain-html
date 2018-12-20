const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const SriPlugin = require("webpack-subresource-integrity");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackIncludeAssetsPlugin = require("html-webpack-include-assets-plugin");

const DESTINATION_PATH = path.resolve(__dirname, "./dist");

const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  entry: path.resolve(__dirname, "src", "index.js"),
  output: {
    path: DESTINATION_PATH,
    crossOriginLoading: "anonymous",
    filename: !devMode ? "[contenthash].js" : "[name].js",
    chunkFilename: !devMode ? "[contenthash].js" : "[name].js"
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      chunks: "async",
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all"
        }
      }
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: false,
        parallel: false,
        sourceMap: devMode
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: devMode
                ? "[emoji:6]---[path]-[name]-[ext]---[local]--"
                : "[sha512:hash:base52:3]"
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: devMode ? "[name].css" : "[name].[contenthash].css",
      chunkFilename: devMode ? "[id].css" : "[id].[contenthash].css"
    }),
    new SriPlugin({
      hashFuncNames: ["sha256", "sha384"],
      enabled: !devMode
    }),
    new CopyWebpackPlugin([
      {
        from: "contrib/**/*",
        to: DESTINATION_PATH,
        flatten: true
      },
      {
        from: "node_modules/odometer/themes",
        to: "odometer/themes"
      }
    ]),
    new HtmlWebpackPlugin({
      title: "MFU Count",
      meta: {
        viewport: "width=device-width, initial-scale=1.0, shrink-to-fit=no"
      }
    }),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: ["odometer/themes/odometer-theme-car.css"],
      append: false
    })
  ]
};
