import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemMenuApi } from '#/api/basis/system/menu';

import { useAccess } from '@vben/access';

const { hasAccessByCodes } = useAccess();

export function getMenuTypeOptions() {
  return [
    {
      color: 'processing',
      label: '目录',
      value: 'catalog',
    },
    { color: 'default', label: '菜单', value: 'menu' },
    { color: 'error', label: '按钮', value: 'button' },
    {
      color: 'success',
      label: '内嵌',
      value: 'embedded',
    },
    { color: 'warning', label: '外链', value: 'link' },
  ];
}

export function getStatusOptions() {
  return [
    { color: 'success', label: '已启用', value: 1 },
    { color: 'error', label: '已禁用', value: 2 },
  ];
}

export function useColumns(
  onActionClick: OnActionClickFn<SystemMenuApi.SystemMenu>,
): VxeTableGridOptions<SystemMenuApi.SystemMenu>['columns'] {
  return [
    {
      align: 'left',
      field: 'meta.title',
      fixed: 'left',
      slots: { default: 'title' },
      title: '标题', // $t('system.menu.menuTitle'),
      treeNode: true,
      width: 250,
    },
    {
      align: 'center',
      cellRender: { name: 'iconifyIconTag', options: getMenuTypeOptions() },
      field: 'type',
      title: '类型', // $t('system.menu.type'),
      width: 100,
    },
    {
      cellRender: { name: 'CellTag', options: getStatusOptions() },
      field: 'status',
      title: '状态', // $t('system.menu.status'),
      width: 100,
    },
    {
      field: 'auth_code',
      title: '权限标识', // $t('system.menu.authCode'),
      width: 200,
    },
    {
      align: 'left',
      field: 'path',
      title: '路由地址', // $t('system.menu.path'),
      width: 200,
    },

    {
      align: 'left',
      field: 'component',
      formatter: ({ row }) => {
        switch (row.type) {
          case 'catalog':
          case 'menu': {
            return row.component ?? '';
          }
          case 'embedded': {
            return row.meta?.iframeSrc ?? '';
          }
          case 'link': {
            return row.meta?.link ?? '';
          }
        }
        return '';
      },
      minWidth: 200,
      title: '页面组件', // $t('system.menu.component'),
    },
    {
      align: 'right',
      cellRender: {
        attrs: {
          nameField: 'name',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'append',
            text: '新增下级',
            show: hasAccessByCodes(['system:menu:add']),
          },
          {
            code: 'edit',
            show: hasAccessByCodes(['system:menu:edit']),
          },
          {
            code: 'delete',
            show: hasAccessByCodes(['system:menu:delete']),
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      headerAlign: 'center',
      showOverflow: false,
      title: '操作', // $t('system.menu.operation'),
      width: 210,
    },
  ];
}
