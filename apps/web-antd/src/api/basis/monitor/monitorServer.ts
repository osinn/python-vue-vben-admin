import { requestClient } from '#/api/request';

export namespace MonitorServerApi {
  export interface MonitorServerInfo {
    [key: string]: any;
  }
}

/**
 * 获取监控服务器信息
 */
async function getMonitorServerInfo() {
  return requestClient.post<Array<MonitorServerApi.MonitorServerInfo>>(
    '/monitor/server/getMonitorServerInfo',
  );
}

export { getMonitorServerInfo };
