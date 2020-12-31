"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.download = exports.deleteFiles = exports.uploadDir = exports.uploadFile = void 0;
const common_1 = require("./common");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const axios_1 = require("axios");
function getUploadInfo(dest) {
    return common_1.remoteCall({
        url: '/tcb/uploadfile',
        data: {
            path: dest,
        },
    });
}
function uploadFile(src, dest) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        if (!dest) {
            dest = path.normalize(src);
            dest = dest.replace(/\\/g, '/');
        }
        fs.readFile(src, (err, file) => __awaiter(this, void 0, void 0, function* () {
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
        }));
    }));
}
exports.uploadFile = uploadFile;
function uploadDir(src, dest = '', filter) {
    return new Promise((resolve, reject) => {
        let index = 0;
        while (index < dest.length && (dest[index] === '/' || dest[index] === ' ' || dest[index] === '\t')) {
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
            }
            else if (stat.isFile()) {
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
exports.uploadDir = uploadDir;
function deleteFiles(fileid_list) {
    return common_1.remoteCall({
        url: '/tcb/batchdeletefile',
        data: {
            fileid_list
        }
    });
}
exports.deleteFiles = deleteFiles;
function getDownloadInfo(file_list) {
    return common_1.remoteCall({
        url: '/tcb/batchdownloadfile',
        data: {
            file_list,
        }
    });
}
function download(file_list, dir = '.') {
    return new Promise((resolve, reject) => {
        getDownloadInfo(file_list)
            .then(({ file_list }) => {
            let files = [];
            for (const item of file_list) {
                if (item.status === 0) {
                    const { download_url, fileid } = item;
                    files.push({
                        download_url,
                        fileid,
                    });
                    axios_1.default
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
exports.download = download;
common_1.setEnvironment({
    appid: 'wxb9eeedf9954b45e3',
    secret: '7cf17c83e4e5b5308b494dcec945f553',
    env: 'xiaocaoyueyu-0t5p7',
});
download([
    {
        fileid: 'cloud://xiaocaoyueyu-0t5p7.7869-xiaocaoyueyu-0t5p7-1259807664/src/cloudFunction.ts',
        max_age: 7200,
    },
    {
        fileid: 'cloud://xiaocaoyueyu-0t5p7.7869-xiaocaoyueyu-0t5p7-1259807664/src/cloudFunction.ts',
        max_age: 7200,
    },
    {
        fileid: 'cloud://xiaocaoyueyu-0t5p7.7869-xiaocaoyueyu-0t5p7-1259807664/src/cloudFunction.ts',
        max_age: 7200,
    },
], 'C:\\Users\\aiialzy\\Desktop')
    .then(res => {
})
    .catch(err => {
    console.error(err);
});
