// import './css/index.less';
import './decorator';

Promise.resolve('error').finally(() => console.log('finally'));

const set = new Set([1, 2, 3, 4, 2, 4]);
console.log(set);
