// import './css/index.css';
import './css/index.less';

let logo = require('./assets/bzs_abouttext_img.png');
let img = new Image;
img.src = logo.default;
document.body.appendChild(img);


btn.addEventListener('click', e => {
  console.log(e, '点击btn');
  import(
    /* webpackChunkName: 'title' */
    /* webpackPrefetch: true */
    './title').then(console.log);

  import(
    /* webpackChunkName: 'info' */
    /* webpackMode: 'lazy' */
    './info').then(console.log);
})