import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace OnlineUserApi {
  export interface OnlineUser {
    [key: string]: any;
    id: string;
    account: string;
    nickname: string;
    browser: string;
    ip: string;
    login_time: string;
    login_source: string;
    is_admin: boolean;
    sub: string;
  }
}

/**
 * 获取所有在线用户
 */
async function getOnlineUserAll() {
  return requestClient.get<Array<OnlineUserApi.OnlineUser>>(
    '/online_user/get_online_user_all',
  );
}

/**
 * 在线用户下线
 */
async function onlineUserOffline(sub: string) {
  return requestClient.put<any>(`/online_user/${sub}/offline`);
}

/**
 * 刷新在线用户权限
 */
async function refreshOnlineUserPermission(sub: string) {
  return requestClient.put<any>(`/online_user/${sub}/refresh_user_permission`);
}

export { getOnlineUserAll, onlineUserOffline, refreshOnlineUserPermission };
