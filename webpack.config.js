let path = require("path");
let webpack = require('webpack');

module.exports = {
  context: __dirname,

  // entry: ['./static/js/index.js'], // entry point of our app. index.js should require other js modules and dependencies it needs
  entry: {
      schedule: './static/index/schedule_index.js',
      lists: './static/index/lists_index.js',
      stats: './static/index/stats_index.js',
  },
  output: {
      path: path.resolve(__dirname, './static/bundles/'),
      // filename: "[name]-[hash].js",
      filename: "[name].js",
      // filename: "main.js",
  },
  module: {
    rules: [
      {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
      }, // to transform JSX into JS
      {
            test: /\.css$/,
            include: /node_modules/,
            loaders: ['style-loader', 'css-loader'],
      },
    ],
  },

  resolve: {
    // modulesDirectories: ['node_modules'],
    extensions: ['.js', '.jsx']
  },
};