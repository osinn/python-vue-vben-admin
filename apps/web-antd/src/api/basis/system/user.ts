import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemUserApi {
  export interface SystemUser {
    [key: string]: any;
    id: string;
    nickname: string;
    permissions: string[];
    remark?: string;
    status: string;
    account: string;
    english_name: string;
    avatar: string;
    email: string;
    phone: string;
    staff_number: string;
    birthday: string;
    sex: string;
    dept_id: string;
    lock_account: string;
    sort: number;
    remarks: string;
    created_by_name: string;
    created_time: string;
    updated_by_name: string;
    updated_time: string;
    dept_name: string;
    post_ids: string[];
    role_ids: string[];
  }
  export interface PageParams {
    page_num: number;
    page_size: number;
    /** 账号 */
    account?: string;
    /** 用户名称 */
    name?: string;
    /** 邮箱 */
    email?: string;
    /** 手机号 */
    phone?: string;
    /** 工号 */
    staff_number?: string;
    /** 部门ID */
    dept_id?: string;
  }

  export interface ResetPwdParams {
    /** 用户ID */
    id: string;
    /** 密码 */
    password: string;
  }
}

/**
 * 分页获取用户列表数据
 */
async function getUserList(params: SystemUserApi.PageParams) {
  return requestClient.post<Array<SystemUserApi.SystemUser>>(
    '/system/user/get_user_list',
    params,
  );
}

/**
 * 分页全部用户列表数据
 */
async function fetchUserListAll() {
  return requestClient.get<Array<SystemUserApi.SystemUser>>(
    '/system/user/get_user_list_all',
  );
}

/**
 * 创建用户
 * @param data 用户数据
 */
async function createUser(data: Omit<SystemUserApi.SystemUser, 'id'>) {
  return requestClient.post('/system/user/add_user', data);
}

/**
 * 更新用户
 *
 * @param id 用户 ID
 * @param data 用户数据
 */
async function updateUser(
  id: string,
  data: Omit<SystemUserApi.SystemUser, 'id'>,
) {
  return requestClient.put(`/system/user/edit_user`, { ...data, id });
}

/**
 * 更改状态
 *
 * @param id 数据ID
 * @param data 状态
 */
async function changeUserStatus(data: Recordable<any>) {
  return requestClient.put(`/system/user/sys_user_change_status`, data);
}

/**
 * 删除用户
 * @param id 用户 ID
 */
async function deleteUser(id: string) {
  return requestClient.delete(`/system/user/${id}/delete_user`);
}

/**
 * 重置密码
 * @param data
 */
async function resetPwd(data: SystemUserApi.ResetPwdParams) {
  return requestClient.put(`/system/user/sys_user_reset_pwd`, data);
}

export {
  changeUserStatus,
  createUser,
  deleteUser,
  fetchUserListAll,
  getUserList,
  resetPwd,
  updateUser,
};
