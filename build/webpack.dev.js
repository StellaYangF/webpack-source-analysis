const { smart } = require('webpack-merge');
const path = require('path');
const base = require('./webpack.base');

const resolve = (filename) => path.resolve(__dirname, filename);

module.exports = smart(base, {
  mode: 'development',
  devServer: {
    contentBase: resolve('dist'),
    host: 'localhost',
    compress: true,
    port: 8080,
    before(app) {
      app.get('/api/users', (req, res) => {
        res.json([{ id: 1, name: 'Stella' }]);
      });
    },
    // proxy
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  devtool: 'source-map', // 'eval'
});
