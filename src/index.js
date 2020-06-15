// const title = require('./title');


btn.addEventListener('click', e => {
  console.log(e, '点击btn');
  import(
    /* webpackChunkName: 'title' */
    /* webpackPrefetch: true */
    './title').then(console.log);

  import(
    /* webpackChunkName: 'info' */
    /* webpackPrefetch: true */
    './info').then(console.log);
})
// btn.addEventListener('click', e => {
//   console.log(e, '点击btn 捕获');
//   import('./title').then(console.log);
// }, true)
// 

// console.log(title);