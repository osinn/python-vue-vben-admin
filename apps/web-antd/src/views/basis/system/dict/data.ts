import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemDictApi } from '#/api';

import { useAccess } from '@vben/access';

const { hasAccessByCodes } = useAccess();

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'RadioGroup',
      fieldName: 'isDefault',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      component: 'Input',
      fieldName: 'dictName',
      label: '字典名称',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'dictCode',
      label: '字典编码',
      rules: 'required',
      dependencies: {
        triggerFields: ['isDefault'],
        disabled(values) {
          return values.isDefault;
        },
      },
    },
    {
      component: 'RadioGroup',
      fieldName: 'status',
      label: '状态',
      defaultValue: 'ENABLE',
      dependencies: {
        triggerFields: ['isDefault'],
        disabled(values) {
          return values.isDefault;
        },
      },
      componentProps: {
        isButton: true,
        options: [
          { label: '已启用', value: 'ENABLE' },
          { label: '已禁用', value: 'DISABLE' },
        ],
      },
    },
    {
      component: 'Input',
      fieldName: 'remarks',
      label: '备注',
      componentProps: {
        type: 'textarea',
        rows: 3,
        placeholder: '请输入备注',
      },
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'searchKey',
      label: '搜索关键字',
      componentProps: {
        clearable: true,
        placeholder: '请输入字典名称/字典编码',
      },
    },
    {
      component: 'Select',
      componentProps: {
        clearable: true,
        options: [
          { label: '已启用', value: 'ENABLE' },
          { label: '已禁用', value: 'DISABLE' },
        ],
        placeholder: '请选择状态',
      },
      fieldName: 'status',
      label: '状态',
    },
    {
      component: 'Select',
      componentProps: {
        clearable: true,
        options: [
          { label: '是', value: true },
          { label: '否', value: false },
        ],
        placeholder: '请选择',
      },
      fieldName: 'isDefault',
      label: '是否系统默认',
    },
  ];
}

export function useColumns<T = SystemDictApi.SystemDict>(
  onActionClick: OnActionClickFn<T>,
  onStatusChange?: (newStatus: any, row: T) => PromiseLike<any | undefined>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'dictCode',
      title: '字典编码',
      width: 200,
    },
    {
      field: 'dictName',
      title: '字典名称',
      width: 200,
    },
    {
      cellRender: {
        attrs: {
          beforeChange: onStatusChange,
          hasAccessByCodes: ['system:dict:edit'],
          disabled: (row: SystemDictApi.SystemDict) => {
            return row.isDefault;
          },
        },
        name: 'CellSwitch',
      },
      field: 'status',
      title: '状态',
      width: 200,
    },
    {
      field: 'isDefault',
      title: '系统内置',
      width: 200,
      cellRender: {
        name: 'CellTag',
        options: [
          { color: 'processing', label: '否', value: false },
          { color: 'red', label: '是', value: true },
        ],
      },
    },
    {
      field: 'remarks',
      minWidth: 100,
      title: '备注',
    },
    {
      field: 'createdTime',
      title: '创建时间',
      width: 200,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'dictName',
          nameTitle: '字典',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'append',
            text: '字典项',
            show: hasAccessByCodes(['system:dictItem:list']),
          },
          {
            code: 'edit',
            show: hasAccessByCodes(['system:dict:edit']),
          },
          {
            code: 'delete',
            show: hasAccessByCodes(['system:dict:delete']),
            disabled: (row: SystemDictApi.SystemDict) => {
              return row.isDefault;
            },
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 260,
    },
  ];
}
