import { remoteCall } from './common';

/**
 * 触发云函数
 * @param {string} fnName 云函数名称
 * @param {string} data 云函数参数
 * 
 * 详情请看：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/functions/invokeCloudFunction.html
 */
export function callCloudFunction(fnName: string, data: object) {
  return remoteCall({
    url: '/tcb/invokecloudfunction',
    query: {
      name: fnName,
    },
    data,
  });
}