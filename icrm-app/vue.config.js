const webpack = require('webpack');
const isDev = process.env.NODE_ENV === 'development';
// 按需自动引入el-ui插件
// const AutoImport = require('unplugin-auto-import/webpack')
// const Components = require('unplugin-vue-components/webpack')
// const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

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
      // AutoImport({
      //   resolvers: [ElementPlusResolver()]
      // }),
      // Components({
      //   resolvers: [ElementPlusResolver()]
      // }),
    ]
  }
};