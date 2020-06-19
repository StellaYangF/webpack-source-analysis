// import './css/index.less';
// import Person from './decorator';

const btn = document.querySelector('#btn');

btn.addEventListener('click', () => {
  import(
    /* webpackChunkName: 'info' */
    /* webpackPrefetch: true */
    './info'
  );
});

btn.addEventListener('click', () => {
  import(
    /* webpackChunkName: 'title' */
    /* webpackPreload: true */
    './title'
  );
});

// Promise.resolve('error').finally(() => console.log('finally'));

const set = new Set([1, 2, 3, 4, 2, 4]);
console.log(set);
