import { requestClient } from '#/api/request';

export namespace SysHttpLogApi {
  export interface SysHttpLog {
    [key: string]: any;
    /** 日志ID */
    id: string;
    /** 用户id */
    user_id: string;
    /** 用户账号 */
    account: string;
    /** 用户名称 */
    nickname: string;
    /** ip地址 */
    ip_address: string;
    /** ip地址归属地 */
    ip_address_attr: string;
    /** 请求uri */
    request_uri: string;
    /** 请求参数 */
    request_params: any;
    /** 请求类型：POST/GET */
    request_method: string;
    /** 操作方法 */
    class_method: string;
    /** 状态 true-成功 false-失败 */
    status: boolean;
    /**  执行时间分秒格式： 00:00 */
    execution_time: string;
    /** 异常信息 */
    exception_msg: string;
    /** 浏览器类型 */
    browser: string;
    /** 操作系统 */
    os: string;
    /** 日志来源 */
    source: string;
    /** 日志类型 */
    log_type: string;
    /** 动作描述 */
    action_desc: string;
    /** 业务模块：业务模块主要是用在业务中台，区分业务，例如车辆模块、商城模块 */
    business_module: string;
    /** 日志模块名称 业务模块下面的具体模块菜单-例如-用户管理 */
    module_name: string;
    /** 操作类型 */
    operate_type: string;
    /** 是否是移动端请求，true-是，false-不是 */
    mobile: boolean;
    /** 创建时间 */
    created_time: string;
    /** 响应结果数据 */
    result_data?: any;
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
async function getSysHttpLogList(params: SysHttpLogApi.SysHttpLogPageParam) {
  return requestClient.post<Array<SysHttpLogApi.SysHttpLog>>(
    '/log/get_login_log_info_list',
    params
  );
}

export { getSysHttpLogList };
