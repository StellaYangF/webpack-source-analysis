const loaderUtils = require('loader-utils');
const validateOptions = require('schema-utils');
const fs = require('fs');

module.exports = function(source) {
    let cb = this.async();
    this.cacheable　&&　this.cacheable();
    let schema = {
        type: 'object',
        properties: {
            filename: {
                type: 'string',
            },
            text: {
                type: 'string'
            },
        }
    };
    let options = loaderUtils.getOptions(this);
    validateOptions(schema, options);
    let { filename } = options;
    // 读取 banner 信息，拼接源码
    fs.readFile(filename, 'utf8', (err, text) => cb(err, text + source));
}