import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemDictItemApi } from '#/api';

import { useAccess } from '@vben/access';

const { hasAccessByCodes } = useAccess();

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'dict_id',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      component: 'RadioGroup',
      fieldName: 'is_default',
      dependencies: {
        triggerFields: ['is_default'],
        show: () => false,
      },
    },
    {
      component: 'Input',
      fieldName: 'dict_item_name',
      label: '字典项名称',
      rules: 'required',
      componentProps: {
        allowClear: true,
        placeholder: '请输入字典项名称',
      },
    },
    {
      component: 'Input',
      fieldName: 'dict_item_code',
      label: '字典项值',
      rules: 'required',
      dependencies: {
        disabled: (values) => {
          return values.is_default === 1;
        },
        triggerFields: ['is_default'],
      },
      componentProps: {
        allowClear: true,
        placeholder: '请输入字典项值',
      },
    },
    // {
    //   component: 'RadioGroup',
    //   fieldName: 'status',
    //   label: '状态',
    //   defaultValue: 'ENABLE',
    //   componentProps: {
    //     isButton: true,
    //     options: [
    //       { label: "已启用", value: "ENABLE" },
    //       { label: "已禁用", value: "DISABLE" },
    //     ],
    //   }
    // },
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
    // {
    //   component: 'Input',
    //   fieldName: 'remarks',
    //   label: "备注",
    //   componentProps: {
    //     type: 'textarea',
    //     rows: 3,
    //     placeholder: "请输入备注",
    //   }
    // }
  ];
}

export function useColumns<T = SystemDictItemApi.SystemDictItem>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'dict_item_name',
      title: '字典项名称',
      width: 200,
    },
    {
      field: 'dict_item_code',
      title: '字典项编码',
      width: 200,
    },
    {
      field: 'is_default',
      title: '系统内置',
      width: 100,
      cellRender: {
        name: 'CellTag',
        options: [
          { color: 'processing', label: '否', value: 2 },
          { color: 'red', label: '是', value: 1 },
        ],
      },
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'dict_item_name',
          nameTitle: '字典项',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'edit',
            show: hasAccessByCodes(['system:dictItem:edit']),
          },
          {
            code: 'delete',
            show: hasAccessByCodes(['system:dictItem:delete']),
            disabled: (row: SystemDictItemApi.SystemDictItem) => {
              return row.is_default === 1;
            },
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 150,
    },
  ];
}
