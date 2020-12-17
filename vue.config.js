// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, on Mac: sudo npm run / sudo yarn
const devServerPort = 9527; // TODO: get this variable from setting.ts
const mockServerPort = 9528; // TODO: get this variable from setting.ts
const name = 'Swift Admin'; // TODO: get this variable from setting.ts
const server = {
  DEV: process.env.VUE_APP_SERVER_DEV,
  TEST: process.env.VUE_APP_SERVER_TEST,
  PRO: process.env.VUE_APP_SERVER_PRO,
  BUILD: process.env.VUE_APP_SERVER
};

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/vue-typescript-admin-template/' : '/',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: devServerPort,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    progress: false,
    // 本文件修改，重启后才能生效
    // proxy: 这里的vue代理是 vue静态服务器做代理。使用的是 http-proxy-middleware 这个模块（这个模块相当于是node.js的一个插件）
    // devServer：前端开发服务器，即本机
    // proxy的作用：这将告诉 devServer 将任何未知请求（与静态文件不匹配的请求）代理到 target 指向的地址(Api服务器)
    // target地址，即API服务器，既可以是本机localhost(常见的如mock数据时，如本项目)， 也可以是另外一个远程服务器（mock数据的专用服务器、测试环境联调的服务器、 生产环境的服务器）
    // 本项目target是本机 http://127.0.0.1，配置为：server的url=/mock-api/v1 server的port=9528，因此服务器上的Api地址形式为 http://127.0.0.1:9528/mock-api/v1
    // 相关知识: https://cli.vuejs.org/config/#devserver-proxy
    // 相关知识: https://panjiachen.github.io/vue-element-admin-site/zh/guide/essentials/mock-api.html#%E6%96%B0%E6%96%B9%E6%A1%88
    // 相关知识: https://rgb-24bit.github.io/blog/2018/glob.html （代理地址匹配规则）
    // pathRewrite： 使用proxy进行代理时，对请求地址进行重定向，以匹配到正确的请求地址（要根据前后端的地址实际情况来做配置）
    proxy: {
      /* 本框架，模拟数据接口的路径，规定都是以/mock开头，然后代理到本地的mock-serve服务器 */
      '/mock': {
        target: `http://127.0.0.1:${mockServerPort}/mock-api/v1`,
        changeOrigin: true, // needed for virtual hosted sites
        ws: true, // proxy websockets
        logLevel: 'debug', // 设置为debug可在Terminal看见代理的真实请求地址
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      },
      /* 本框架，真实数据接口的路径，确保不要包含mock字符串，才能保证被正确的代理到指定的服务器 */
      '[!mock]': {
        target: process.env.NODE_ENV === 'production' ? server.BUILD : server[process.env.VUE_APP_ENV],
        changeOrigin: true,
        ws: true,
        logLevel: 'debug',
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
  },
  pwa: {
    name: name,
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: path.resolve(__dirname, 'src/pwa/service-worker.js')
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, 'src/styles/_variables.scss'),
        path.resolve(__dirname, 'src/styles/_mixins.scss')
      ]
    }
  },
  chainWebpack(config) {
    // provide the app's title in html-webpack-plugin's options list so that
    // it can be accessed in index.html to inject the correct title.
    // https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-plugin
    config.plugin('html').tap(args => {
      args[0].title = name;
      return args;
    });

    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ]);

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch');

    // https://webpack.js.org/configuration/devtool/#development
    // Change development env source map if you want.
    // The default in vue-cli is 'eval-cheap-module-source-map'.
    // config
    //   .when(process.env.NODE_ENV === 'development',
    //     config => config.devtool('eval-cheap-source-map')
    //   )

    config.
      when(process.env.NODE_ENV !== 'development',
        config => {
          config.
            optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: path.resolve(__dirname, 'src/components'),
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            });
          // https://webpack.js.org/configuration/optimization/#optimizationruntimechunk
          config.optimization.runtimeChunk('single');
        }
      );
  }
};
