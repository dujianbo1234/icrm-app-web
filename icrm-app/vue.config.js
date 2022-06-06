const webpack = require('webpack');
const isDev = process.env.NODE_ENV === 'development';
module.exports = {
  publicPath: './',
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          BASE_URL: JSON.stringify(process.env.BASE_URL),
          CLIENT_NAME: JSON.stringify(process.env.CLIENT_NAME),
          NODE_ENV: isDev ? "development" : "production"
        }
      }),
    ]
  }
};