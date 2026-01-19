import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemDictApi {
  export interface SystemDict {
    [key: string]: any;
    id: string;
    dict_code: string;
    dict_name: string;
    remark?: string;
    status?: number;
    is_default: number;
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
    '/system/dict/get_dict_list',
    data,
  );
}

/**
 * 新增
 */
async function createDict(data: Omit<SystemDictApi.SystemDict, 'id'>) {
  return requestClient.post<Array<SystemDictApi.SystemDict>>(
    '/system/dict/add_dict',
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
  return requestClient.put<Array<SystemDictApi.SystemDict>>(
    '/system/dict/edit_dict',
    { ...data, id },
  );
}

/**
 * 删除菜单
 * @param id ID
 */
async function deleteDict(id: string) {
  return requestClient.delete(`/system/dict/${id}/delete_dict`);
}

/**
 * 更改状态
 *
 * @param id 数据ID
 * @param data 状态
 */
async function changeStatus(data: Recordable<any>) {
  return requestClient.put(`/system/dict/dict_change_status`, data);
}

export { changeStatus, createDict, deleteDict, fetchDictList, updateDict };
