import { requestClient } from '#/api/request';

export namespace SysHttpLogApi {
  export interface SysHttpLog {
    [key: string]: any;
    /** 日志ID */
    id: string;
    /** 用户id */
    userId: string;
    /** 用户账号 */
    account: string;
    /** 用户名称 */
    nickname: string;
    /** ip地址 */
    ipAddress: string;
    /** ip地址归属地 */
    ipAddressAttr: string;
    /** 请求uri */
    requestUri: string;
    /** 请求参数 */
    requestParams: any;
    /** 请求类型：POST/GET */
    requestMethod: string;
    /** 操作方法 */
    classMethod: string;
    /** 状态 true-成功 false-失败 */
    status: boolean;
    /**  执行时间分秒格式： 00:00 */
    executionTime: string;
    /** 异常信息 */
    exceptionMsg: string;
    /** 浏览器类型 */
    browser: string;
    /** 操作系统 */
    os: string;
    /** 日志来源 */
    source: string;
    /** 日志类型 */
    logType: string;
    /** 动作描述 */
    actionDesc: string;
    /** 业务模块：业务模块主要是用在业务中台，区分业务，例如车辆模块、商城模块 */
    businessModule: string;
    /** 日志模块名称 业务模块下面的具体模块菜单-例如-用户管理 */
    moduleName: string;
    /** 操作类型 */
    operateType: string;
    /** 是否是移动端请求，true-是，false-不是 */
    mobile: boolean;
    /** 创建时间 */
    createdTime: string;
    /** 响应结果数据 */
    resultData?: any;
  }

  export interface SysHttpLogPageParam {
    [key: string]: any;
    /** 搜索关键字：用户账号/用户名称/ip地址归属地/请求uri/模块名称 */
    searchKey: string;
    /** 状态 true-成功 false-失败 */
    status: boolean;
    /** 日志来源 */
    source: string;
    /** 日志类型 */
    logType: string;
    /** 操作类型 */
    operateType: string;
  }
}

/**
 * 获取系统请求日志
 */
async function getSysHttpLogList(data: SysHttpLogApi.SysHttpLogPageParam) {
  return requestClient.post<Array<SysHttpLogApi.SysHttpLog>>(
    '/sysHttpLog/getSysHttpLogList',
    data,
  );
}

export { getSysHttpLogList };
