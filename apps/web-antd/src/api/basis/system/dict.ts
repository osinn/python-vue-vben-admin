import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemDictApi {
  export interface SystemDict {
    [key: string]: any;
    id: string;
    dict_code: string;
    dict_name: string;
    remark?: string;
    status?: string;
    is_default: boolean;
    created_by_name: string;
    created_time: string;
    updated_by_name: string;
    updated_time: string;
  }
}

/**
 * 分页查询
 */
async function fetchDictList(data: Recordable<any>) {
  return requestClient.post<Array<SystemDictApi.SystemDict>>(
    '/system/dict/fetchDictList',
    data,
  );
}

/**
 * 新增
 */
async function createDict(data: Omit<SystemDictApi.SystemDict, 'id'>) {
  return requestClient.post<Array<SystemDictApi.SystemDict>>(
    '/system/dict/addDict',
    data,
  );
}

/**
 * 编辑
 */
async function updateDict(
  id: string,
  data: Omit<SystemDictApi.SystemDict, 'id'>,
) {
  return requestClient.post<Array<SystemDictApi.SystemDict>>(
    '/system/dict/editDict',
    { ...data, id },
  );
}

/**
 * 删除菜单
 * @param id ID
 */
async function deleteDict(id: string) {
  return requestClient.post(`/system/dict/deleteDict`, { ids: [id] });
}

/**
 * 更改状态
 *
 * @param id 数据ID
 * @param data 状态
 */
async function changeStatus(data: Recordable<any>) {
  return requestClient.post(`/system/dict/changeDictStatus`, data);
}

export { changeStatus, createDict, deleteDict, fetchDictList, updateDict };
