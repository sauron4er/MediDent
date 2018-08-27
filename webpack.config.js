let path = require("path");
let webpack = require('webpack');
let BundleTracker = require('webpack-bundle-tracker');
const CleanWebpackPlugin = require('clean-webpack-plugin');
let pathsToClean = [
  './static/bundles/*.*'
];

module.exports = {
  context: __dirname,

  entry: {
      schedule: './static/index/schedule_index.js',
      clients: './static/index/clients_index.js',
      stats: './static/index/stats_index.js',
  },
  output: {
      path: path.resolve(__dirname, './static/bundles/'),
      filename: "[name]-[hash].js",
  },

  plugins: [
    new CleanWebpackPlugin(pathsToClean, {watch: true, beforeEmit: true}),
    new BundleTracker({filename: './webpack-stats.json'}),
  ],

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
      {     test: /\.css$/,
            exclude: /node_modules/,
            loader: "style-loader!css-loader"
      },
    ],
  },

  resolve: {
    // modulesDirectories: ['node_modules'],
    extensions: ['.js', '.jsx']
  },
};