import { remoteCall, CommonResponse, setEnvironment } from './common';
import * as fs from 'fs';
import * as path from 'path';
import * as FormData from 'form-data';
import axios from 'axios';

/**
 * 获取文件上传信息
 * @param {string} dest 云端路径
 * 
 * 详情请看：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/storage/uploadFile.html
 */
function getUploadInfo(dest: string) {
  return remoteCall({
    url: '/tcb/uploadfile',
    data: {
      path: dest,
    },
  });
}

interface UploadInfo extends CommonResponse {
  url: string;
  token: string;
  authorization: string;
  file_id: string;
  cos_file_id: string;
}

/**
 * 上传文件
 * @param {string} src 源路径
 * @param {string} dest 云端路径
 * 
 * 详情请看：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/storage/uploadFile.html
 */
export function uploadFile(src: string, dest: string) {
  return new Promise(async (resolve, reject) => {
    if (!dest) {
      dest = path.normalize(src);
      dest = dest.replace(/\\/g, '/');
    }
    fs.readFile(src, async (err: Error, file: Buffer) => {
      if (err) {
        reject(err);
        return;
      }
      getUploadInfo(dest)
        .then((res: UploadInfo) => {
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

type Filter = (p: string) => boolean;

/**
 * 上传文件夹
 * @param {string} src 源路径
 * @param {string} dest 云端路径
 * @param {Function} filter 文件过滤
 */
export function uploadDir(src: string, dest: string = '', filter?: Filter) {
  return new Promise((resolve, reject) => {
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
        if (filter && !filter(p)) {
          continue;
        }
        let parsedPath = path.parse(p);
        let tem = path.normalize(`${parsedPath.dir}/${parsedPath.name}${parsedPath.ext}`);
        tem = tem.substring(src.length - 1);
        if (dest) {
          tem = `${dest}/${tem}`;
        }
        tem = tem.replace(/\\/g, '/');
        tem = tem.replace(/\/\//g, '/');
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
 * 删除云端文件
 * @param {array} fileid_list 文件列表
 * 
 * 详情请看：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/storage/batchDeleteFile.html
 */
export function deleteFiles(fileid_list: [string]) {
  return remoteCall({
    url: '/tcb/batchdeletefile',
    data: {
      fileid_list
    }
  });
}

/**
 * 获取文件下载信息
 * @param {[string]} file_list 
 * 
 * 详情请看：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/storage/batchDownloadFile.html
 */
function getDownloadInfo(file_list: Array<CloudFileDownloadInfo>) {
  return remoteCall({
    url: '/tcb/batchdownloadfile',
    data: {
      file_list,
    }
  });
}

interface CloudFile {
  status: number;
  errmsg: string;
  fileid: string;
  download_url: string;
}

interface CloudFileDownloadInfo {
  fileid: string;
  max_age: number;
}

/**
 * 下载文件到指定文件夹
 * @param {array} file_list 
 * @param {string} dir 
 */
export function download(file_list: Array<CloudFileDownloadInfo>, dir: string = '.') {
  return new Promise((resolve, reject) => {
    getDownloadInfo(file_list)
      .then(({ file_list }: { file_list: [CloudFile] }) => {
        let files = [];
        for (const item of file_list) {
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