const axios = require('axios');

const token = {
  val: '',
  validTime: 0,
};

const cloudInfo = {
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
  const appid = cloudInfo.appid;
  const secret = cloudInfo.secret;
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
    axios
      .get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`)
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
function setEnvironment(config) {
  cloudInfo.appid = config.appid;
  cloudInfo.secret = config.secret;
  cloudInfo.env = config.env;
}

function remoteCall(config) {
  return new Promise((resolve, reject) => {
    const { env } = cloudInfo;
    if (!env) {
      reject('无效env.')
    }
    getToken()
      .then((access_token) => {
        let query = '';
        if (config.query) {
          const q = config.query;
          for (const key in config.query) {
            query += `&${key}=${q[key]}`;
          }
        }

        axios
          .post(`https://api.weixin.qq.com${config.url}?access_token=${access_token}${query}`, {
            env,
            ...config.args,
          })
          .then(({ data }) => {
            const { errcode, errmsg } = data;
            if (errcode && errcode !== 0) {
              reject(errmsg);
              return;
            }
            if (config.cb) {
              resolve(config.cb(data));
            } else {
              resolve(data);
            }
          })
          .catch((err) => {
            reject(err);
          })
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = {
  getToken,
  cloudInfo,
  setEnvironment,
  remoteCall,
};