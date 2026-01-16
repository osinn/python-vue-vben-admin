import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SysConfigApi {
  export interface SysConfig {
    [key: string]: any;
    /** 主键 */
    id: string;

    /** 配置组名称 */
    config_group_name: string;

    /** 参数名称 */
    config_name: string;

    /** 参数键名 */
    config_key: string;

    /** 参数键值 */
    config_value: string;

    /** 备注 */
    remarks: string;

    /** 状态 1正常；2禁用 */
    status: number;

    /** 是否系统内置 */
    is_default: number;

    /** 创建人 */
    created_by: string;

    /** 创建时间 */
    created_time: string;

    /** 更新人 */
    updated_by: string;

    /** 更新时间 */
    updated_time: string;
  }
  export interface SysConfigPageParam {
    [key: string]: any;
    /** 配置组名称 */
    config_group_name: string;

    /** 参数名称 */
    config_name: string;

    /** 参数键名 */
    config_key: string;

    /** 参数键值 */
    config_value: string;

    /** 是否系统内置 */
    is_default: number;

    /** 状态 1正常；2禁用 */
    status: number;

    /** 创建时间 */
    created_time: string;
  }
}

/**
 * 查询系统参数列表
 */
async function getSysConfigList(data: SysConfigApi.SysConfigPageParam) {
  return requestClient.post<Array<SysConfigApi.SysConfig>>(
    '/system/config/get_sys_config_list',
    data,
  );
}

/**
 * 新增系统参数
 * @param data 新增数据
 */
async function createSysConfig(data: Omit<SysConfigApi.SysConfig, 'id'>) {
  return requestClient.post('/system/config/add_sys_config', data);
}

/**
 * 更新系统参数
 *
 * @param id ID
 * @param data 更新数据
 */
async function updateSysConfig(
  id: string,
  data: Omit<SysConfigApi.SysConfig, 'id'>,
) {
  return requestClient.put(`/system/config/edit_sys_config`, { ...data, id });
}

/**
 * 删除
 * @param id ID
 */
async function deleteSysConfig(id: string) {
  return requestClient.delete(`/system/config/${id}/delete_sys_config`);
}

/**
 * 更改状态
 *
 * @param id 数据ID
 * @param data 状态
 */
async function changeSysConfigStatus(data: Recordable<any>) {
  return requestClient.put(`/system/config/sys_config_change_status`, data);
}

/**
 * 获取全部配置组名称列表
 *
 * @param id 数据ID
 * @param data 状态
 */
async function getSysConfigGroupNameListAll() {
  return requestClient.get(`/system/config/get_sys_config_group_name_list_all`);
}

export {
  changeSysConfigStatus,
  createSysConfig,
  deleteSysConfig,
  getSysConfigGroupNameListAll,
  getSysConfigList,
  updateSysConfig,
};
