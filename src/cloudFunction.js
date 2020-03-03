const { remoteCall } = require('./common');

function callCloudFunction(fnName, args) {
  return remoteCall({
    url: '/tcb/invokecloudfunction',
    query: {
      name: fnName,
    },
    args
  });
}

module.exports = {
  callCloudFunction,
};