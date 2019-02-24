const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackIncludeAssetsPlugin = require("html-webpack-include-assets-plugin");

const DESTINATION_PATH = path.resolve(__dirname, "./public");

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
      inject: false,
      template: require('html-webpack-template'),
      appMountId: '🍻',
      googleAnalytics: {
        trackingId: 'UA-135007596-1',
        pageViewOnLoad: true
      },
      title: "MFU Count",
      mobile: true,
      lang: 'en-US',
    }),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: ["odometer/themes/odometer-theme-car.css"],
      append: false
    })
  ]
};
