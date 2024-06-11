const { override, addWebpackAlias, addWebpackModuleRule } = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    "stream": require.resolve("stream-browserify"),
    "os": require.resolve("os-browserify/browser")
  }),
  addWebpackModuleRule({
    test: /\.js$/,
    include: /node_modules/,
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env']
    }
  })
);
