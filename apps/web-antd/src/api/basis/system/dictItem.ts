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
    status?: number;
    is_default: number;
    created_by_name: string;
    created_time: string;
    updated_by_name: string;
    updated_time: string;
  }
}

/**
 * 获取字典所有字典项列表
 */
async function fetchDictItemListAll(dict_id: string) {
  return requestClient.get<Array<SystemDictItemApi.SystemDictItem>>(
    `/system/dict_item/${dict_id}/get_dict_item_list_all_by_dict_id`,
  );
}

/**
 * 新增
 */
async function createDictItem(
  data: Omit<SystemDictItemApi.SystemDictItem, 'id'>,
) {
  return requestClient.post<Array<SystemDictItemApi.SystemDictItem>>(
    '/system/dict_item/add_dict_item',
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
  return requestClient.put<Array<SystemDictItemApi.SystemDictItem>>(
    '/system/dict_item/edit_dict_item',
    { ...data, id },
  );
}

/**
 * 删除菜单
 * @param id ID
 */
async function deleteDictItem(id: string) {
  return requestClient.delete(`/system/dict_item/${id}/delete_dict_item`);
}

export { createDictItem, deleteDictItem, fetchDictItemListAll, updateDictItem };
