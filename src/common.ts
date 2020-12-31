import axios from 'axios';

interface CloudInfoParams {
  readonly appid: string;
  readonly secret: string;
  readonly env: string;
}

class CloudInfo {
  readonly appid: string;
  readonly secret: string;
  readonly env: string;

  constructor(cloudInfoParams: CloudInfoParams) {
    this.appid = cloudInfoParams.appid;
    this.secret = cloudInfoParams.secret;
    this.env = cloudInfoParams.env;
  }
}

class Token {
  readonly value: string;
  readonly validTime: number;

  constructor(value: string, validTime: number) {
    this.value = value;
    this.validTime = validTime;
  }
}

let cloudInfo: CloudInfo = null;
let token: Token = null;

export interface CommonResponse {
  readonly errcode: number;
  readonly errmsg: string;
}


/**
 * 检查环境变量的设置
 */
export function checkEnv(): boolean {
  if (cloudInfo === null) {
    throw new Error('请先调用setEnvironment方法进行环境初始化');
  }
  if (cloudInfo.appid.trim().length === 0) {
    throw new Error('请正确设置appid');
  }
  if (cloudInfo.secret.trim().length === 0) {
    throw new Error('请正确设置secret');
  }
  if (cloudInfo.env.trim().length === 0) {
    throw new Error('请正确设置env');
  }
  return true;
}

/**
 *设置云开发调用环境
 * @param {string} appid 
 * @param {string} secret 
 * @param {string} env 
 */
export function setEnvironment(cloudInfoParams: CloudInfoParams) {
  cloudInfo = new CloudInfo(cloudInfoParams);
}

/**
 * 获取小程序全局唯一后台接口调用凭据
 * @param {string} appid 
 * @param {string} secret 
 */
export function getToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    checkEnv();
    const appid = cloudInfo.appid;
    const secret = cloudInfo.secret;
    if (!appid) {
      reject('无效appid.');
      return;
    } else if (!secret) {
      reject('无效secret.');
      return;
    } else if (token !== null && Date.now() - token.validTime < 0) {
      resolve(token.value);
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
        token = new Token(access_token, Date.now() + expires_in * 1000)
        resolve(access_token);
      })
      .catch((err) => {
        reject(err);
      })
  });
}

export interface RemoteCallParams {
  readonly url: string;
  readonly [query: string]: any;
  readonly data: object;
  readonly cb?: Function;
}

/**
 * 远程调用
 * @param {RemoteCallParams} params
 */
export function remoteCall(params: RemoteCallParams) {
  return new Promise((resolve, reject) => {
    checkEnv();
    const { env } = cloudInfo;
    getToken()
      .then((access_token) => {
        let query = '';
        if (params.query) {
          const q = params.query;
          for (const key in params.query) {
            query += `&${key}=${q[key]}`;
          }
        }

        const url = `https://api.weixin.qq.com${params.url}?access_token=${access_token}&env=${env}${query}`;
        axios
          .post(url, {
            env,
            ...params.data,
          })
          .then(({ data }) => {
            const { errcode, errmsg } = data;
            if (errcode && errcode !== 0) {
              reject(errmsg);
              return;
            }
            if (params.cb) {
              resolve(params.cb(data));
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