import type { VNode } from 'vue';

import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn } from '#/adapter/vxe-table';
import type { SysHttpLogApi } from '#/api/basis/monitor/sysHttpLog';

import { renderBrowserIcon, renderOsIcon } from '#/components/render';
import { OperateStatusEnum } from '#/enums/logOperateEnum';

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'searchKey',
      label: '搜索关键字',
      componentProps: {
        clearable: true,
        placeholder: '请输入登录账号',
      },
    },
    {
      component: 'Select',
      componentProps: {
        clearable: true,
        options: OperateStatusEnum,
        placeholder: '请选择状态',
      },
      fieldName: 'status',
      label: '状态',
    },
    {
      component: 'DatePicker',
      fieldName: 'createdTime',
      componentProps: {
        type: 'daterange',
        clearable: true,
        rangeSeparator: '到',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
      },
      label: '登录时间',
    },
  ];
}

/**
 * 获取表格列配置
 * @description 使用函数的形式返回列数据而不是直接export一个Array常量，是为了响应语言切换时重新翻译表头
 * @param onActionClick 表格操作按钮点击事件
 */
export function useColumns(
  onActionClick?: OnActionClickFn<SysHttpLogApi.SysHttpLog>,
): VxeTableGridOptions<SysHttpLogApi.SysHttpLog>['columns'] {
  return [
    {
      field: 'createdTime',
      title: '登录时间',
      width: 200,
    },
    {
      field: 'account',
      title: '登录账号',
    },
    {
      field: 'status',
      title: '登录状态',
      cellRender: {
        name: 'CellTag',
        options: OperateStatusEnum,
      },
    },
    {
      field: 'ipAddress',
      title: 'IP地址',
      showFooterOverflow: true,
    },
    {
      field: 'ipAddressAttr',
      title: 'IP地址归属地',
      showFooterOverflow: true,
    },
    {
      field: 'browser',
      title: '浏览器',
      slots: {
        default: ({ row }) => {
          return renderBrowserIcon(row.browser) as VNode;
        },
      },
    },
    {
      field: 'os',
      title: '操作系统',
      slots: {
        default: ({ row }) => {
          return renderOsIcon(row.os) as VNode;
        },
      },
    },
    {
      field: 'source',
      title: '日志来源',
    },
    // {
    //   field: 'mobile',
    //   title: '是否移动端',
    // },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'info',
          nameTitle: '操作',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'append',
            text: '查看',
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
