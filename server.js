const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackOptions = require('./build/webpack.dev');

const app = express();

const compiler = webpack(webpackOptions);
app.use(webpackDevMiddleware(compiler, {}));
app.get('/api', (req, res) => {
  res.json({
    name: 'stella',
    age: 18,
  });
});

app.listen(3000);
