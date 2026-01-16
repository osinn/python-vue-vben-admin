// 操作枚举
export const OperateTypeEnum = [
  {
    label: '新增',
    value: 'INSERT',
    color: 'success',
  },
  {
    label: '修改',
    value: 'UPDATE',
    color: 'warning',
  },
  {
    label: '删除',
    value: 'DELETE',
    color: 'red',
  },
  {
    label: '查询',
    value: 'QUERY',
    color: 'primary',
  },
  {
    label: '授权',
    value: 'GRANT',
    color: 'primary',
  },
  {
    label: '导出',
    value: 'EXPORT',
    color: 'info',
  },
  {
    label: '导入',
    value: 'IMPORT',
    color: 'warning',
  },
  {
    label: '强退',
    value: 'FORCE',
    color: 'red',
  },
  {
    label: '清空数据',
    value: 'CLEAN_DATA',
    color: 'warning',
  },
  {
    label: '其它',
    value: 'OTHER',
    color: 'info',
  },
];

export const OperateStatusEnum = [
  {
    label: '成功',
    value: true,
    color: 'success',
  },
  {
    label: '失败',
    value: false,
    color: 'red',
  },
];

export const MethodEnum = [
  {
    label: 'POST',
    value: 'POST',
    color: 'success',
  },
  {
    label: 'GET',
    value: 'GET',
    color: 'red',
  },
];
