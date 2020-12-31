"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remoteCall = exports.getToken = exports.setEnvironment = exports.checkEnv = void 0;
const axios_1 = require("axios");
class CloudInfo {
    constructor(cloudInfoParams) {
        this.appid = cloudInfoParams.appid;
        this.secret = cloudInfoParams.secret;
        this.env = cloudInfoParams.env;
    }
}
class Token {
    constructor(value, validTime) {
        this.value = value;
        this.validTime = validTime;
    }
}
let cloudInfo = null;
let token = null;
function checkEnv() {
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
exports.checkEnv = checkEnv;
function setEnvironment(cloudInfoParams) {
    cloudInfo = new CloudInfo(cloudInfoParams);
}
exports.setEnvironment = setEnvironment;
function getToken() {
    return new Promise((resolve, reject) => {
        checkEnv();
        const appid = cloudInfo.appid;
        const secret = cloudInfo.secret;
        if (!appid) {
            reject('无效appid.');
            return;
        }
        else if (!secret) {
            reject('无效secret.');
            return;
        }
        else if (token !== null && Date.now() - token.validTime < 0) {
            resolve(token.value);
            return;
        }
        axios_1.default
            .get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`)
            .then((res) => {
            const { data } = res;
            const { access_token, expires_in, errcode, errmsg } = data;
            if (errcode && errcode !== 0) {
                throw new Error(`${errcode} ${errmsg}`);
            }
            token = new Token(access_token, Date.now() + expires_in * 1000);
            resolve(access_token);
        })
            .catch((err) => {
            reject(err);
        });
    });
}
exports.getToken = getToken;
function remoteCall(params) {
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
            axios_1.default
                .post(url, Object.assign({ env }, params.data))
                .then(({ data }) => {
                const { errcode, errmsg } = data;
                if (errcode && errcode !== 0) {
                    reject(errmsg);
                    return;
                }
                if (params.cb) {
                    resolve(params.cb(data));
                }
                else {
                    resolve(data);
                }
            })
                .catch((err) => {
                reject(err);
            });
        })
            .catch((err) => {
            reject(err);
        });
    });
}
exports.remoteCall = remoteCall;
