const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: {
    charts: ["@babel/polyfill", "./assets/js/charts.js"],
    about: ["@babel/polyfill", "./assets/js/about.js"],
    keystone: ["@babel/polyfill", "./assets/js/keystone.js"],
    portfolio: ["@babel/polyfill", "./assets/js/portfolio.js"],
    finance: ["@babel/polyfill", "./assets/js/finance.js"],
    trader: ["@babel/polyfill", "./assets/js/trader.js"],
  },
  devServer: {
    contentBase: "./dist",
  },
  devtool: "inline-source-map",
  output: {
    filename: "[name].min.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          "css-loader",
        ],
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "assets/js"),
        exclude: /(node_modules)|(dist)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(jpe?g|png|gif|svg|otf|ttf)$/i,
        loader: "file-loader?name=/assets/[name].[ext]",
      },
    ],
  },
  optimization: {
    minimizer: [new OptimizeCssAssetsPlugin(), new TerserPlugin()],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "charts.html",
      template: "./templates/charts.html",
      inject: false,
    }),
    new HtmlWebpackPlugin({
      filename: "about.html",
      template: "./templates/about.html",
      inject: false,
    }),
    new HtmlWebpackPlugin({
      filename: "keystone.html",
      template: "./templates/keystone.html",
      inject: false,
    }),
    new HtmlWebpackPlugin({
      filename: "portfolio.html",
      template: "./templates/portfolio.html",
      inject: false,
    }),
    new HtmlWebpackPlugin({
      filename: "finance.html",
      template: "./templates/finance.html",
      inject: false,
    }),
    new HtmlWebpackPlugin({
      filename: "trader.html",
      template: "./templates/trader.html",
      inject: false,
    }),
    new MiniCssExtractPlugin({ filename: "[name].min.css" }),
  ],
};
