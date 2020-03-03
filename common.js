const axios = require('axios');

const token = {
  val: '',
  validTime: 0,
};

const info = {
  appid: '',
  secret: '',
  env: '',
};

/**
 * 获取小程序全局唯一后台接口调用凭据
 * @param {string} appid 
 * @param {string} secret 
 */
function getToken() {
  const appid = info.appid;
  const secret = info.secret;
  if (!appid) {
    throw new Error('无效appid.');
  } else if (!secret) {
    throw new Error('无效secret.');
  }
  return new Promise((resolve, reject) => {
    if (Date.now() - token.validTime < 0) {
      resolve(token.val);
      return;
    }
    axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`)
      .then((res) => {
        const { data } = res;
        const { access_token, expires_in, errcode, errmsg } = data;
        if (errcode && errcode !== 0) {
          throw new Error(`${errcode} ${errmsg}`);
        }
        token.validTime = Date.now() + expires_in * 1000;
        resolve(access_token);
      })
      .catch((err) => {
        reject(err);
      })
  });
}

/**
 *设置云开发调用环境
 * @param {string} appid 
 * @param {string} secret 
 * @param {string} env 
 */
function setEnvironment(appid, secret, env) {
  info.appid = appid;
  info.secret = secret;
  info.env = env;
}

module.exports = {
  getToken,
  cloudInfo: info,
  setEnvironment,
};