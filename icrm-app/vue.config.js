const webpack = require('webpack');

module.exports = {
  publicPath: './',
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          BASE_URL: JSON.stringify(process.env.BASE_URL),
          CLIENT_NAME: JSON.stringify(process.env.CLIENT_NAME)
        }
      }),
    ]
  }
};
