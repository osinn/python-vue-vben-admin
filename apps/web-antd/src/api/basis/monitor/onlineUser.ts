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
    loginTime: string;
    loginSource: string;
    hasAdmin: boolean;
  }
}

/**
 * 获取所有在线用户
 */
async function getOnlineUserAll() {
  return requestClient.post<Array<OnlineUserApi.OnlineUser>>(
    '/onlineUser/getOnlineUserAll',
  );
}

/**
 * 在线用户下线
 */
async function onlineUserOffline(data: Recordable<any>) {
  return requestClient.post<any>('/onlineUser/offline', data);
}

/**
 * 刷新在线用户权限
 */
async function refreshOnlineUserPermission(data: Recordable<any>) {
  return requestClient.post<any>('/onlineUser/offline', data);
}

export { getOnlineUserAll, onlineUserOffline, refreshOnlineUserPermission };
