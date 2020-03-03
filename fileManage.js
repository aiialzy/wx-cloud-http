const common = require('./common');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

/**
 * 获取文件上传信息
 * @param {string} dest 
 */
function getUploadInfo(dest) {
  const { env } = common.cloudInfo;
  if (!env) {
    throw new Error('无效env.');
  }
  return new Promise((resolve, reject) => {
    common
      .getToken()
      .then((access_token) => {
        axios
          .post(`https://api.weixin.qq.com/tcb/uploadfile?access_token=${access_token}`, {
            env,
            path: dest,
          })
          .then(({ data }) => {
            const { errcode, errmsg } = data;
            if (errcode !== 0) {
              throw new Error(`${errcode} ${errmsg}`);
            }
            resolve(data);
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

/**
 * 上传文件
 * @param {string} src 
 * @param {string} dest 
 */
function uploadFile(src, dest) {
  return new Promise(async (resolve, reject) => {
    if (!dest) {
      dest = path.normalize(src);
      dest = dest.replace(/\\/g, '/');
    }
    fs.readFile(src, async (err, file) => {
      if (err) {
        reject(err);
        return;
      }
      getUploadInfo(dest)
        .then((res) => {
          const { url, token, authorization, cos_file_id, file_id } = res;
          const form = new FormData();
  
          form.append('key', dest);
          form.append('Signature', authorization);
          form.append('x-cos-security-token', token);
          form.append('x-cos-meta-fileid', cos_file_id);
          form.append('file', file);
    
          form.submit(url, (err, res) => {
            if (err) {
              reject(err);
              return;
            }
            resolve({ file_id });
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
}

/**
 * 上传文件夹
 * @param {string} src 
 * @param {string} dest 
 */
function uploadDir(src, dest) {
  return new Promise((resolve, reject) => {
    if (!dest) {
      dest = '';
    }

    // 去除开头的 / 和空白
    let index = 0;
    while (index<dest.length && (dest[index]==='/' || dest[index]===' ' || dest[index]==='\t')) {
      index += 1;
    }
    dest = dest.substring(index);

    const promises = [];
    const paths = [src];
    while (paths.length) {
      const p = paths.shift();

      const stat = fs.statSync(p);
      if (stat.isDirectory()) {
        fs.readdirSync(p)
          .forEach((item) => {
            paths.push(`${p}/${item}`);
          });

      } else if (stat.isFile()) {
        let tem = path.parse(p);
        tem = path.normalize(`${tem.dir}/${tem.name}${tem.ext}`);
        if (dest) {
          tem = `${dest}/${tem}`;
        }
        tem = tem.replace(/\\/g, '/');
        promises.push(uploadFile(p, tem));
      }
    }
    Promise
      .all(promises)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * 判断文件类型并上传文件
 * @param {string} src 
 * @param {string} dest 
 */
function upload(src, dest) {
  return new Promise((resolve, reject) => {
    const stat = fs.statSync(src);
    if (stat.isFile()) {
      uploadFile(src, dest)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        })
    } else if (stat.isDirectory()) {
      uploadDir(src, dest)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    }
  });
}

/**
 * 获取文件下载信息
 * @param {array} file_list 
 */
function getDownloadInfo(file_list) {
  return new Promise((resolve, reject) => {
    const { env } = common.cloudInfo;
    common
      .getToken()
      .then((access_token) => {
        axios
          .post(`https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=${access_token}`, {
            env,
            file_list,
          })
          .then(({ data }) => {
            const { errcode, errmsg, file_list } = data;
            if (errcode !== 0) {
              reject(errmsg);
              return;
            }
            resolve(file_list);
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

/**
 * 下载文件到指定文件夹
 * @param {array} file_list 
 * @param {string} dir 
 */
function download(file_list, dir) {
  return new Promise((resolve, reject) => {
    getDownloadInfo(file_list)
      .then((list) => {
        let files = [];
        if (!dir) {
          dir = '.';
        }
        for (const item of list) {
          if (item.status === 0) {
            const { download_url, fileid } = item;
            files.push({
              download_url,
              fileid,
            });
            axios
              .get(encodeURI(item.download_url))
              .then(({ data }) => {
                const index = fileid.lastIndexOf('/');
                const relativePath = fileid.substring(index);
                const p = path.join(dir, relativePath);
                fs.writeFile(p, data, (err) => {
                  if (err) {
                    console.error(err);
                  }
                });
              })
              .catch((err) => {
                console.error(err);
              });
          }
        }
        resolve(files);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

/**
 * 删除云端文件
 * @param {array} fileid_list 
 */
function deleteFiles(fileid_list) {
  return new Promise((resolve, reject) => { 
    const { env } = common.cloudInfo;
    common
      .getToken()
      .then((access_token) => {
        axios
        .post(`https://api.weixin.qq.com/tcb/batchdeletefile?access_token=${access_token}`, {
          env,
          fileid_list,
        })
        .then(({ data }) => {
          const { errcode, errmsg, delete_list } = data;
          if (errcode !== 0) {
            reject(errmsg);
            return;
          }
          resolve(delete_list);
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

module.exports = {
  upload,
  getDownloadInfo,
  download,
  deleteFiles,
};