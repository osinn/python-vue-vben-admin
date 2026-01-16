import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemMenuApi } from '#/api/basis/system/menu';

import { $t } from '#/locales';

export function getMenuTypeOptions() {
  return [
    {
      color: 'processing',
      label: $t('system.menu.typeCatalog'),
      value: 'catalog',
    },
    { color: 'default', label: $t('system.menu.typeMenu'), value: 'menu' },
    { color: 'error', label: $t('system.menu.typeButton'), value: 'button' },
    {
      color: 'success',
      label: $t('system.menu.typeEmbedded'),
      value: 'embedded',
    },
    { color: 'warning', label: $t('system.menu.typeLink'), value: 'link' },
  ];
}

export function getStatusOptions() {
  return [
    { color: 'success', label: '已启用', value: 'ENABLE' },
    { color: 'error', label: '已禁用', value: 'DISABLE' },
  ];
}

export function useColumns(): VxeTableGridOptions<SystemMenuApi.SystemMenu>['columns'] {
  return [
    {
      align: 'left',
      fixed: 'left',
      title: '',
      // slots: { default: 'checkboxMenu' },
      type: 'checkbox',
      width: 100,
    },
    {
      align: 'left',
      field: 'meta.title',
      slots: { default: 'title' },
      title: '标题',
      treeNode: true,
      width: 400,
    },
    {
      align: 'left',
      cellRender: { name: 'CellTag', options: getMenuTypeOptions() },
      field: 'type',
      title: '类型', // $t('system.menu.type'),
    },
  ];
}
