const fileManage = require('./src/fileManage');
const common = require('./src/common');
const cloudFunction = require('./src/cloudFunction');

module.exports = {
  ...common,
  ...fileManage,
  ...cloudFunction,
};