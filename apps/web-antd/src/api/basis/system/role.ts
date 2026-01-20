import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemRoleApi {
  export interface SystemRole {
    [key: string]: any;
    id: string;
    name: string;
    role_code: string;
    permissions: string[];
    remark?: string;
    status: any;
  }

  export interface AssignRoleMenu {
    role_id: string;
    menu_ids: string[];
  }
}

/**
 * 获取角色列表数据
 */
async function fetchRoleList(params: Recordable<any>) {
  return requestClient.post<Array<SystemRoleApi.SystemRole>>(
    '/system/role/get_role_list',
    params,
  );
}

/**
 * 获取全部角色列表数据
 */
async function fetchRoleListAll(data: Recordable<any>) {
  return requestClient.get<Array<SystemRoleApi.SystemRole>>(
    '/system/role/get_role_list_all',
    { params: data },
  );
}

/**
 * 创建角色
 * @param data 角色数据
 */
async function createRole(data: Omit<SystemRoleApi.SystemRole, 'id'>) {
  return requestClient.post('/system/role/add_role', data);
}

/**
 * 更新角色
 *
 * @param id 角色 ID
 * @param data 角色数据
 */
async function updateRole(
  id: string,
  data: Omit<SystemRoleApi.SystemRole, 'id'>,
) {
  return requestClient.put(`/system/role/edit_role`, { ...data, id });
}

/**
 * 更改状态
 *
 * @param id 数据ID
 * @param data 状态
 */
async function changeRoleStatus(data: Recordable<any>) {
  return requestClient.put(`/system/role/sys_role_change_status`, data);
}

/**
 * 删除角色
 * @param id 角色 ID
 */
async function deleteRole(id: string) {
  return requestClient.post(`/system/role/{id}/delete_role`);
}

/**
 * 角色授权
 */
async function assignMenu(data: SystemRoleApi.AssignRoleMenu) {
  return requestClient.put(`/system/role/assign_menu`, data);
}

export {
  assignMenu,
  changeRoleStatus,
  createRole,
  deleteRole,
  fetchRoleList,
  fetchRoleListAll,
  updateRole,
};
