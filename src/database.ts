import { remoteCall } from './common';

/**
 * 导入
 * @param {object} data
 * 
 * 详情请看：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/database/databaseMigrateImport.html
 */
export function migrateImport(data: object) {
  return remoteCall({
    url: '/tcb/databasemigrateimport',
    data
  });
}

/**
 * 导出
 * @param {object} data
 * 
 * 详情请看：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/database/databaseMigrateExport.html
 */
export function migrateExport(data: object) {
  return remoteCall({
    url: '/tcb/databasemigrateexport',
    data,
  });
}

/**
 * 迁移状态查询
 * @param {object} data
 * 
 * 详情请看：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/database/databaseMigrateQueryInfo.html
 */
export function migrateQueryInfo(job_id: number) {
  return remoteCall({
    url: '/tcb/databasemigratequeryinfo',
    data: {
      job_id,
    }
  });
}

/**
 * 更新索引
 * @param {object} data
 * 
 * 详情请看：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/database/updateIndex.html
 */
export function updateIndex(data: object) {
  return remoteCall({
    url: '/tcb/updateindex',
    data
  });
}

/**
 * 新增集合
 * @param {object} data
 * 
 * 详情请看：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/database/databaseCollectionAdd.html
 */
export function addCollection(collection_name: string) {
  return remoteCall({
    url: '/tcb/databasecollectionadd',
    data: {
      collection_name,
    }
  });
}

/**
 * 删除集合
 * @param {object} data
 * 
 * 详情请看：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/database/databaseCollectionDelete.html
 */
export function deleteCollection(collection_name: string) {
  return remoteCall({
    url: '/tcb/databasecollectiondelete',
    data: {
      collection_name,
    }
  });
}

/**
 * 获取集合信息
 * @param {object} data
 * 
 * 详情请看：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/database/databaseCollectionGet.html
 */
export function getCollectionInfo(limit: number, offset: number) {
  return remoteCall({
    url: '/tcb/databasecollectionget',
    data: {
      limit,
      offset,
    }
  });
}

/**
 * 插入记录
 * @param {object} data
 * 
 * 详情请看：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/database/databaseAdd.html
 */
export function addRecord(query: string) {
  return remoteCall({
    url: '/tcb/databaseadd',
    data: {
      query
    }
  });
}

/**
 * 删除记录
 * @param {object} data
 * 
 * 详情请看：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/database/databaseDelete.html
 */
export function deleteRecord(query: string) {
  return remoteCall({
    url: '/tcb/databasedelete',
    data: {
      query
    }
  });
}

/**
 * 更新记录
 * @param {object} data
 * 
 * 详情请看：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/database/databaseUpdate.html
 */
export function updateRecord(query: string) {
  return remoteCall({
    url: '/tcb/databaseupdate',
    data: {
      query
    }
  });
}

/**
 * 查询记录
 * @param {object} data
 * 
 * 详情请看：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/database/databaseQuery.html
 */
export function queryRecord(query: string) {
  return remoteCall({
    url: '/tcb/databasequery',
    data: {
      query
    }
  });
}

/**
 * 聚合
 * @param {object} data
 * 
 * 详情请看：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/database/databaseAggregate.html
 */
export function aggregate(query: string) {
  return remoteCall({
    url: '/tcb/databaseaggregate',
    data: {
      query
    }
  });
}

/**
 * 统计记录数量
 * @param {object} data
 * 
 * 详情请看：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/database/databaseCount.html
 */
export function count(query: string) {
  return remoteCall({
    url: '/tcb/databasecount',
    data: {
      query
    }
  });
}