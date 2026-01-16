import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemDictItemApi } from '#/api';

import { useAccess } from '@vben/access';

const { hasAccessByCodes } = useAccess();

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'dictId',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      component: 'RadioGroup',
      fieldName: 'isDefault',
      dependencies: {
        triggerFields: ['isDefault'],
        show: () => false,
      },
    },
    {
      component: 'Input',
      fieldName: 'dictItemName',
      label: '字典项名称',
      rules: 'required',
      componentProps: {
        clearable: true,
        placeholder: '请输入字典项名称',
      },
    },
    {
      component: 'Input',
      fieldName: 'dictItemCode',
      label: '字典项值',
      rules: 'required',
      dependencies: {
        disabled: (values) => {
          return values.isDefault;
        },
        triggerFields: ['isDefault'],
      },
      componentProps: {
        clearable: true,
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
      field: 'dictItemCode',
      title: '字典项编码',
      width: 200,
    },
    {
      field: 'dictItemName',
      title: '字典项名称',
      width: 200,
    },
    {
      field: 'isDefault',
      title: '系统内置',
      width: 100,
      cellRender: {
        name: 'CellTag',
        options: [
          { color: 'processing', label: '否', value: false },
          { color: 'red', label: '是', value: true },
        ],
      },
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'dictItemName',
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
              return row.isDefault;
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
