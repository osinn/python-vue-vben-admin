import type { VNode } from 'vue';

import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { OnActionClickFn } from '#/adapter/vxe-table';
import type { OnlineUserApi } from '#/api/basis/monitor/onlineUser';

import { useAccess } from '@vben/access';

import { renderBrowserIcon, renderOsIcon } from '#/components/render';

const { hasAccessByCodes } = useAccess();
/**
 * 获取表格列配置
 * @description 使用函数的形式返回列数据而不是直接export一个Array常量，是为了响应语言切换时重新翻译表头
 * @param onActionClick 表格操作按钮点击事件
 */
export function useColumns(
  onActionClick?: OnActionClickFn<OnlineUserApi.OnlineUser>,
): VxeTableGridOptions<OnlineUserApi.OnlineUser>['columns'] {
  return [
    {
      field: 'account',
      title: '账号',
      treeNode: true,
    },
    {
      field: 'nickname',
      title: '名称',
    },
    {
      field: 'loginTime',
      title: '登录时间',
    },
    {
      field: 'ip',
      title: 'IP地址',
      showFooterOverflow: true,
    },
    {
      field: 'operatingSystem',
      title: '操作系统',
      showFooterOverflow: true,
      slots: {
        default: ({ row }) => {
          return renderOsIcon(row.operatingSystem, true) as VNode;
        },
      },
    },
    {
      field: 'browser',
      title: '浏览器',
      showFooterOverflow: true,
      slots: {
        default: ({ row }) => {
          return renderBrowserIcon(row.browser, true) as VNode;
        },
      },
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: '操作',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'refreshPermission',
            text: '刷新权限',
            title: (row: OnlineUserApi.OnlineUser) => {
              return `要刷新【${row.nickname}】权限吗？`;
            },
            show: hasAccessByCodes(['login:user:refreshPermission']),
            type: 'primary',
            confirmBtn: true,
          },
          {
            code: 'online',
            text: '强制下线',
            title: (row: OnlineUserApi.OnlineUser) => {
              return `要强制下线【${row.nickname}】吗？`;
            },
            show: hasAccessByCodes(['login:user:offline']),
            type: 'danger',
            confirmBtn: true,
          },
        ],
      },
      field: 'operation',
      headerAlign: 'center',
      showOverflow: false,
      title: '操作',
    },
  ];
}
