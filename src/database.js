const { remoteCall } = require('./common');

function migrateImport(args) {
  return remoteCall({
    url: '/tcb/databasemigrateimport',
    args
  });
}

function migrateExport(args) {
  return remoteCall({
    url: '/tcb/databasemigrateexport',
    args,
  });
}

function migrateQueryInfo(job_id) {
  return remoteCall({
    url: '/tcb/databasemigratequeryinfo',
    args: {
      job_id,
    }
  });
}

function updateIndex(args) {
  return remoteCall({
    url: '/tcb/updateindex',
    args
  });
}

function addCollection(collection_name) {
  return remoteCall({
    url: '/tcb/databasecollectionadd',
    args: {
      collection_name,
    }
  });
}

function deleteCollection(collection_name) {
  return remoteCall({
    url: '/tcb/databasecollectiondelete',
    args: {
      collection_name,
    }
  });
}

function getCollectionInfo(limit, offset) {
  return remoteCall({
    url: '/tcb/databasecollectionget',
    args: {
      limit,
      offset,
    }
  });
}

function addRecord(query) {
  return remoteCall({
    url: '/tcb/databaseadd',
    args: {
      query
    }
  });
}

function deleteRecord(query) {
  return remoteCall({
    url: '/tcb/databasedelete',
    args: {
      query
    }
  });
}

function updateRecord(query) {
  return remoteCall({
    url: '/tcb/databaseupdate',
    args: {
      query
    }
  });
}

function queryRecord(query) {
  return remoteCall({
    url: '/tcb/databasequery',
    args: {
      query
    }
  });
}

function aggregate(query) {
  return remoteCall({
    url: '/tcb/databaseaggregate',
    args: {
      query
    }
  });
}

function count(query) {
  return remoteCall({
    url: '/tcb/databasecount',
    args: {
      query
    }
  });
}

module.exports = {
  migrateImport,
  migrateExport,
  migrateQueryInfo,
  updateIndex,
  addCollection,
  deleteCollection,
  getCollectionInfo,
  addRecord,
  deleteRecord,
  updateRecord,
  queryRecord,
  aggregate,
  count,
};
