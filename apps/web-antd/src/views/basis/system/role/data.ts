import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemRoleApi } from '#/api';

import { useAccess } from '@vben/access';

const { hasAccessByCodes } = useAccess();

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'RadioGroup',
      fieldName: 'is_default',
      label: '系统内置',
      defaultValue: false,
      componentProps: {
        options: [
          { label: '是', value: 1 },
          { label: '否', value: 2 },
        ],
      },
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: '角色名称',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'role_code',
      label: '角色编码',
      rules: 'required',
      dependencies: {
        triggerFields: ['is_default'],
        disabled(values) {
          return values.is_default === 1;
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
      component: 'InputNumber',
      fieldName: 'sort',
      label: '排序号',
      defaultValue: 1,
      componentProps: {
        min: 1,
        step: 1,
        precision: 0,
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
    {
      component: 'Input',
      fieldName: 'permissions',
      formItemClass: 'items-start',
      label: '', // $t('system.role.setPermissions'),
      modelPropName: 'modelValue',
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '角色名称',
      componentProps: {
        allowClear: true,
        placeholder: '请输入角色名称',
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
      component: 'RangePicker',
      fieldName: 'created_time',
      componentProps: {
        allowClear: true,
        rangeSeparator: '到',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
      },
      label: '创建时间',
    },
  ];
}

export function useColumns<T = SystemRoleApi.SystemRole>(
  onActionClick: OnActionClickFn<T>,
  onStatusChange?: (newStatus: any, row: T) => PromiseLike<any | undefined>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'name',
      title: '角色名称',
      width: 200,
    },
    {
      field: 'role_code',
      title: '角色编码',
      width: 200,
    },
    {
      cellRender: {
        attrs: {
          beforeChange: onStatusChange,
          hasAccessByCodes: ['system:role:edit'],
          disabled: (row: SystemRoleApi.SystemRole) => {
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
      minWidth: 100,
      title: '系统内置',
      cellRender: {
        name: 'CellTag',
        options: [
          { color: 'processing', label: '否', value: 2 },
          { color: 'red', label: '是', value: 1 },
        ],
      },
      titlePrefix: {
        content: `系统内置角色不允许删除、修改状态、修改角色编码`,
      },
    },
    {
      field: 'sort',
      minWidth: 100,
      title: '排序号',
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
          nameField: 'name',
          nameTitle: '角色',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'edit',
            show: hasAccessByCodes(['system:role:edit']),
          },
          {
            code: 'delete',
            show: hasAccessByCodes(['system:role:delete']),
            disabled: (row: SystemRoleApi.SystemRole) => {
              return row.isDefault;
            },
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 130,
    },
  ];
}
