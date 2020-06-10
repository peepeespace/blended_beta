const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        charts: ['@babel/polyfill', './assets/js/charts.js']
    },
    devServer: {
        contentBase: './dist'
    },
    devtool: 'inline-source-map',
    output: {
      filename: '[name].min.js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
            test: /\.js$/,
            include: path.resolve(__dirname, 'assets/js'),
            exclude: /(node_modules)|(dist)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        },
        {
          test: /\.(jpe?g|png|gif|svg|otf|ttf)$/i, 
          loader: "file-loader?name=/assets/[name].[ext]"
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
          filename: 'charts.html',
          template: './templates/charts.html',
          inject: false
      })
    ]
  };