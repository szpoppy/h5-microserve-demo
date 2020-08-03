module.exports = {
  devServer: {
    port: 9000
  },
  // 样式配置
  css: {
    // css不单独一个文件编译
    extract: false,
    loaderOptions: {}
  },
  // eslint-disable-next-line
  configureWebpack(conf) {
    conf.devtool = 'source-map'
  },
  chainWebpack(conf) {}
}
