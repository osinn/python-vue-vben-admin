/**
 * import { 枚举名称 } from '#/enums/systemEnums';
 */
// 状态枚举
export const StatusEnum = [
  {
    label: '启用',
    value: 0,
  },
  {
    label: '禁用',
    value: 1,
  },
];

// 是否显示
export const VisibleEnum = [
  {
    label: '显示',
    value: 'SHOW',
  },
  {
    label: '隐藏',
    value: 'HIDE',
  },
];

// 菜单枚举
export const MenuTypeEnum = [
  {
    label: '目录',
    value: 'DIR',
  },
  {
    label: '菜单',
    value: 'MENU',
  },
  {
    label: '按钮',
    value: 'BUTTON',
  },
];

// 逻辑枚举
export const LogicEnum = [
  {
    label: '是',
    value: 'YES',
  },
  {
    label: '否',
    value: 'NO',
  },
];

// 是否缓存枚举
export const KeepaliveEnum = [
  {
    label: '缓存',
    value: 'YES_CACHE',
  },
  {
    label: '不缓存',
    value: 'NO_CACHE',
  },
];

// 登录方式枚举
export const GrantTypeEnum = [
  {
    label: '用户名密码模式',
    value: 'USERNAME_PASSWORD',
  },
  {
    label: '手机号短信模式',
    value: 'MOBILE_CODE',
  },
];

export const SexEnum = [
  {
    label: '男',
    value: 1,
  },
  {
    label: '女',
    value: 2,
  },
  {
    label: '未知',
    value: 3,
  },
];
export const OrgTypeEnum = [
  {
    label: '公司',
    value: 1,
  },
  {
    label: '部门',
    value: 2,
  },
  {
    label: '小组',
    value: 3,
  },
  {
    label: '其他',
    value: 4,
  },
];

/**
 * 系统日志状态
 */
export const LogStatusEnum = [
  {
    label: '成功',
    value: 'SUCCESS',
  },
  {
    label: '失败',
    value: 'FAIL',
  },
];

/**
 * 系统日志操作类型
 */
export const SysLogTypeEnum = [
  {
    label: '登录',
    value: 'LOGIN',
  },
  {
    label: '请求接口',
    value: 'REQUEST',
  },
  {
    label: '未知',
    value: 'UNKNOWN',
  },
];
/**
 * 系统日志操作类型
 */
export const SysLogSourceEnum = [
  {
    label: 'web后台管理系统',
    value: 'WEB',
  },
  {
    label: '小程序平台',
    value: 'MP',
  },
  {
    label: 'H5移动端平台',
    value: 'H5',
  },
  {
    label: '应用平台',
    value: 'APP',
  },
  {
    label: '苹果平台',
    value: 'IOS',
  },
  {
    label: '未知',
    value: 'UNKNOWN',
  },
];
