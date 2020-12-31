"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callCloudFunction = void 0;
const common_1 = require("./common");
function callCloudFunction(fnName, data) {
    return common_1.remoteCall({
        url: '/tcb/invokecloudfunction',
        query: {
            name: fnName,
        },
        data,
    });
}
exports.callCloudFunction = callCloudFunction;
