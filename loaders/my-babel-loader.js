const babel = require('@babel/core');
function loader(source, inputSourceMap) {
  console.log(source, 'source');
  console.log(inputSourceMap, 'inputSourceMap');
}