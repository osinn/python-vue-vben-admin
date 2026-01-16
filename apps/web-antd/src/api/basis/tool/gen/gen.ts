import type { GenInfo } from './model.d';

import { requestClient } from '#/api/request';

enum Api {
  batchGenCode = '/tool/gen/batchGenCode',
  columnList = '/tool/gen/column',
  dataSourceNames = '/tool/gen/getDataNames',
  download = '/tool/gen/download',
  genCode = '/tool/gen/genCode',
  generatedList = '/tool/gen/list',
  importTable = '/tool/gen/importTable',
  preview = '/tool/gen/preview',
  readyToGenList = '/tool/gen/db/list',
  root = '/tool/gen',
  syncDb = '/tool/gen/synchDb',
}
// 查询代码生成列表
export function generatedList(params?: any) {
  return requestClient.get(Api.generatedList, { params });
}

// 修改代码生成业务
export function genInfo(tableId: any) {
  return requestClient.get<GenInfo>(`${Api.root}/${tableId}`);
}

// 查询数据库列表
export function readyToGenList(params?: any) {
  return requestClient.get(Api.readyToGenList, { params });
}

// 查询数据表字段列表
export function columnList(tableId: any) {
  return requestClient.get(`${Api.columnList}/${tableId}`);
}

/**
 * 导入表结构（保存）
 * @param tables table名称数组 如sys_a, sys_b
 * @param dataName 数据源名称
 * @returns ret
 */
export function importTable(tables: string | string[]) {
  return requestClient.post(
    Api.importTable,
    { tables },
    {
      successMessageMode: 'message',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
    },
  );
}

// 修改保存代码生成业务
export function editSave(data: any) {
  return requestClient.post(Api.root, data);
}

// 删除代码生成
export function genRemove(tableIds: any) {
  return requestClient.post(`${Api.root}/${tableIds}`);
}

// 预览代码
export function previewCode(tableId: any) {
  return requestClient.get<{ [key: string]: string }>(
    `${Api.preview}/${tableId}`,
  );
}

// 生成代码（下载方式）
export function genDownload(tableId: any) {
  return requestClient.get<Blob>(`${Api.download}/${tableId}`);
}

// 生成代码（自定义路径）
export function genWithPath(tableId: any) {
  return requestClient.get<void>(`${Api.genCode}/${tableId}`);
}

// 同步数据库
export function syncDb(tableId: any) {
  return requestClient.get(`${Api.syncDb}/${tableId}`, {
    successMessageMode: 'message',
  });
}

// 批量生成代码
export function batchGenCode(tableIds: any) {
  return requestClient.get<Blob>(Api.batchGenCode, {
    isTransformResponse: false,
    params: { tableIds },
    responseType: 'blob',
  });
}

// 查询数据源名称列表
export function getDataSourceNames() {
  return requestClient.get<string[]>(Api.dataSourceNames);
}
