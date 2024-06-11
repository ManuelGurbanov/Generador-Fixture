const webpack = require('webpack');
const path = require('path');

module.exports = {
  webpack: {
    alias: {
      "stream": require.resolve("stream-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "buffer": require.resolve("buffer")
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser'
      })
    ]
  }
};
