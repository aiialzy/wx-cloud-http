"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.count = exports.aggregate = exports.queryRecord = exports.updateRecord = exports.deleteRecord = exports.addRecord = exports.getCollectionInfo = exports.deleteCollection = exports.addCollection = exports.updateIndex = exports.migrateQueryInfo = exports.migrateExport = exports.migrateImport = void 0;
const common_1 = require("./common");
function migrateImport(data) {
    return common_1.remoteCall({
        url: '/tcb/databasemigrateimport',
        data
    });
}
exports.migrateImport = migrateImport;
function migrateExport(data) {
    return common_1.remoteCall({
        url: '/tcb/databasemigrateexport',
        data,
    });
}
exports.migrateExport = migrateExport;
function migrateQueryInfo(job_id) {
    return common_1.remoteCall({
        url: '/tcb/databasemigratequeryinfo',
        data: {
            job_id,
        }
    });
}
exports.migrateQueryInfo = migrateQueryInfo;
function updateIndex(data) {
    return common_1.remoteCall({
        url: '/tcb/updateindex',
        data
    });
}
exports.updateIndex = updateIndex;
function addCollection(collection_name) {
    return common_1.remoteCall({
        url: '/tcb/databasecollectionadd',
        data: {
            collection_name,
        }
    });
}
exports.addCollection = addCollection;
function deleteCollection(collection_name) {
    return common_1.remoteCall({
        url: '/tcb/databasecollectiondelete',
        data: {
            collection_name,
        }
    });
}
exports.deleteCollection = deleteCollection;
function getCollectionInfo(limit, offset) {
    return common_1.remoteCall({
        url: '/tcb/databasecollectionget',
        data: {
            limit,
            offset,
        }
    });
}
exports.getCollectionInfo = getCollectionInfo;
function addRecord(query) {
    return common_1.remoteCall({
        url: '/tcb/databaseadd',
        data: {
            query
        }
    });
}
exports.addRecord = addRecord;
function deleteRecord(query) {
    return common_1.remoteCall({
        url: '/tcb/databasedelete',
        data: {
            query
        }
    });
}
exports.deleteRecord = deleteRecord;
function updateRecord(query) {
    return common_1.remoteCall({
        url: '/tcb/databaseupdate',
        data: {
            query
        }
    });
}
exports.updateRecord = updateRecord;
function queryRecord(query) {
    return common_1.remoteCall({
        url: '/tcb/databasequery',
        data: {
            query
        }
    });
}
exports.queryRecord = queryRecord;
function aggregate(query) {
    return common_1.remoteCall({
        url: '/tcb/databaseaggregate',
        data: {
            query
        }
    });
}
exports.aggregate = aggregate;
function count(query) {
    return common_1.remoteCall({
        url: '/tcb/databasecount',
        data: {
            query
        }
    });
}
exports.count = count;
