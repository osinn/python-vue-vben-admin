import { requestClient } from '#/api/request';

export namespace SystemDictItemApi {
  export interface SystemDictItem {
    [key: string]: any;
    id: string;
    dict_id: string;
    dict_item_code: string;
    dict_item_name: string;
    sort: number;
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
 * 获取字典所有字典项列表
 */
async function fetchDictItemListAll(dictId: string) {
  return requestClient.post<Array<SystemDictItemApi.SystemDictItem>>(
    `/system/dictItem/${dictId}/fetchDictItemListAll`,
  );
}

/**
 * 新增
 */
async function createDictItem(
  data: Omit<SystemDictItemApi.SystemDictItem, 'id'>,
) {
  return requestClient.post<Array<SystemDictItemApi.SystemDictItem>>(
    '/system/dictItem/addDictItem',
    data,
  );
}

/**
 * 编辑
 */
async function updateDictItem(
  id: string,
  data: Omit<SystemDictItemApi.SystemDictItem, 'id'>,
) {
  return requestClient.post<Array<SystemDictItemApi.SystemDictItem>>(
    '/system/dictItem/editDictItem',
    { ...data, id },
  );
}

/**
 * 删除菜单
 * @param id ID
 */
async function deleteDictItem(id: string) {
  return requestClient.post(`/system/dictItem/deleteDictItem`, { ids: [id] });
}

export { createDictItem, deleteDictItem, fetchDictItemListAll, updateDictItem };
