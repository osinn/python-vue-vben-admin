import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemDictApi } from '#/api';

import { useAccess } from '@vben/access';

const { hasAccessByCodes } = useAccess();

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'RadioGroup',
      fieldName: 'is_default',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      component: 'Input',
      fieldName: 'dict_name',
      label: '字典名称',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'dict_code',
      label: '字典编码',
      rules: 'required',
      dependencies: {
        triggerFields: ['is_default'],
        disabled(values) {
          return values.is_default;
        },
      },
    },
    {
      component: 'RadioGroup',
      fieldName: 'status',
      label: '状态',
      defaultValue: 1,
      dependencies: {
        triggerFields: ['is_default'],
        disabled(values) {
          return values.is_default === 1;
        },
      },
      componentProps: {
        isButton: true,
        options: [
          { label: '已启用', value: 1 },
          { label: '已禁用', value: 2 },
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
      fieldName: 'search_key',
      label: '搜索关键字',
      componentProps: {
        allowClear: true,
        placeholder: '请输入字典名称/字典编码',
      },
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: '已启用', value: 1 },
          { label: '已禁用', value: 2 },
        ],
        placeholder: '请选择状态',
      },
      fieldName: 'status',
      label: '状态',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: '是', value: 1 },
          { label: '否', value: 2 },
        ],
        placeholder: '请选择',
      },
      fieldName: 'is_default',
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
      field: 'dict_code',
      title: '字典编码',
      width: 200,
    },
    {
      field: 'dict_name',
      title: '字典名称',
      width: 200,
    },
    {
      cellRender: {
        attrs: {
          beforeChange: onStatusChange,
          hasAccessByCodes: ['system:dict:edit'],
          disabled: (row: SystemDictApi.SystemDict) => {
            return row.is_default === 1;
          },
        },
        name: 'CellSwitch',
      },
      field: 'status',
      title: '状态',
      width: 200,
    },
    {
      field: 'is_default',
      title: '系统内置',
      width: 200,
      cellRender: {
        name: 'CellTag',
        options: [
          { color: 'processing', label: '否', value: 2 },
          { color: 'red', label: '是', value: 1 },
        ],
      },
    },
    {
      field: 'remarks',
      minWidth: 100,
      title: '备注',
    },
    {
      field: 'created_time',
      title: '创建时间',
      width: 200,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'dict_name',
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
              return row.is_default === 1;
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
