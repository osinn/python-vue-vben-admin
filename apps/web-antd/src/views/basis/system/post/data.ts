import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemPostApi } from '#/api';

import { useAccess } from '@vben/access';

const { hasAccessByCodes } = useAccess();

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '岗位名称',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'postCode',
      label: '岗位编码',
      rules: 'required',
    },
    {
      component: 'RadioGroup',
      fieldName: 'status',
      label: '状态',
      defaultValue: 'ENABLE',
      componentProps: {
        isButton: true,
        options: [
          { label: '已启用', value: 'ENABLE' },
          { label: '已禁用', value: 'DISABLE' },
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
        placeholder: '请输入岗位名称/岗位编号',
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
  ];
}

export function useColumns<T = SystemPostApi.SystemPost>(
  onActionClick: OnActionClickFn<T>,
  onStatusChange?: (newStatus: any, row: T) => PromiseLike<any | undefined>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'name',
      title: '岗位名称',
      width: 200,
    },
    {
      field: 'postCode',
      title: '岗位编码',
      width: 200,
    },
    {
      cellRender: {
        attrs: {
          beforeChange: onStatusChange,
          hasAccessByCodes: ['system:post:edit'],
        },
        name: 'CellSwitch',
      },
      field: 'status',
      title: '状态',
      width: 200,
    },
    {
      field: 'sort',
      width: 100,
      title: '排序号',
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
      field: 'createdByName',
      title: '创建人',
      width: 150,
    },
    {
      field: 'updatedTime',
      title: '更新时间',
      width: 200,
    },
    {
      field: 'updatedByName',
      title: '更新人',
      width: 150,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: '岗位',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'edit',
            show: hasAccessByCodes(['system:post:edit']),
          },
          {
            code: 'delete',
            show: hasAccessByCodes(['system:post:delete']),
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
