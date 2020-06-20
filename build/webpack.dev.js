const { smart } = require('webpack-merge');
const path = require('path');
const base = require('./webpack.base');

const resolve = (filename) => path.resolve(__dirname, filename);

module.exports = smart(base, {
  mode: 'development',
  devServer: {
    proxy: {
      // "/api": "http://localhost:3000"
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: { '/api': '' },
      }
    // }
  },
  contentBase: resolve('dist'),
  host: 'localhost',
  compress: true,
  port: 8080,
  // before(app) {
  //   app.get('/api/users', (req, res) => {
  //     res.json([{ id: 1, name: 'Stella' }]);
  //   });
  // },
},
  // devtool: 'source-map', // 'eval'
});
