import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SysConfigApi } from '#/api/basis/system/sysConfig';

import { useAccess } from '@vben/access';

import { getSysConfigGroupNameListAll } from '#/api/basis/system/sysConfig';

const { hasAccessByCodes } = useAccess();

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'search_key',
      label: '搜索关键字',
      componentProps: {
        allowClear: true,
        placeholder: '请输入搜索关键字：参数名称/参数键名/参数键值',
      },
    },
    {
      component: 'ApiSelect',
      componentProps: {
        afterFetch: (data: { name: string; path: string }[]) => {
          return data.map((item: any) => ({
            label: item.label,
            value: item.value,
          }));
        },
        // 菜单接口
        api: getSysConfigGroupNameListAll,
        filterable: true,
        allowClear: true,
        placeholder: '请选择配置组名称',
      },
      fieldName: 'config_group_name',
      label: '配置组名称',
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
export function useColumns<T = SysConfigApi.SysConfig>(
  onActionClick: OnActionClickFn<T>,
  onStatusChange?: (newStatus: any, row: T) => PromiseLike<any | undefined>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'config_group_name',
      title: '配置组名称',
    },
    {
      field: 'config_name',
      title: '参数名称',
    },
    {
      field: 'config_key',
      title: '参数键名',
    },
    {
      field: 'config_value',
      title: '参数键值',
    },
    {
      cellRender: {
        attrs: {
          beforeChange: onStatusChange,
          hasAccessByCodes: ['system:sysConfig:edit'],
          disabled: (row: SysConfigApi.SysConfig) => {
            return row.is_default === 1;
          },
        },
        name: 'CellSwitch',
      },
      field: 'status',
      title: '状态',
      width: 100,
    },
    {
      cellRender: {
        name: 'CellTag',
        options: [
          { color: 'processing', label: '否', value: 2 },
          { color: 'red', label: '是', value: 1 },
        ],
      },
      titlePrefix: {
        content: `系统内置配置不允许删除、修改状态、修改参数名称、修改参数键名`,
      },
      field: 'is_default',
      title: '系统内置',
      width: 120,
    },
    {
      field: 'remarks',
      title: '备注',
    },
    {
      field: 'created_time',
      title: '创建时间',
    },
    {
      field: 'updated_time',
      title: '更新时间',
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'config_name',
          nameTitle: '系统参数',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'edit',
            show: hasAccessByCodes(['system:sysConfig:edit']),
          },
          {
            code: 'delete',
            show: hasAccessByCodes(['system:sysConfig:delete']),
            disabled: (row: SysConfigApi.SysConfig) => {
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

export function useFormSchema(): VbenFormSchema[] {
  return [
    // 表单也要有isDefault字段，否则在判断 configKey 是否禁止填写时获取不到isDefault字段值
    {
      component: 'RadioGroup',
      fieldName: 'is_default',
      label: '系统内置',
      defaultValue: 2,
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
      component: 'ApiSelect',
      fieldName: 'config_group_name',
      label: '配置组名称',
      rules: 'required',
      componentProps: {
        afterFetch: (data: { name: string; path: string }[]) => {
          return data.map((item: any) => ({
            label: item.label,
            value: item.value,
          }));
        },
        // 菜单接口
        api: getSysConfigGroupNameListAll,
        filterable: true,
        allowCreate: true,
        defaultFirstOption: true,
        reserveKeyword: false,
      },
    },
    {
      component: 'Input',
      fieldName: 'config_name',
      label: '参数名称',
      rules: 'required',
      dependencies: {
        disabled: (values) => {
          return values.is_default == 1;
        },
        triggerFields: ['config_key'],
      },
    },
    {
      component: 'Input',
      fieldName: 'config_key',
      label: '参数键名',
      rules: 'required',
      dependencies: {
        disabled: (values) => {
          return values.is_default == 1;
        },
        triggerFields: ['config_key'],
      },
    },
    {
      component: 'Input',
      fieldName: 'config_value',
      label: '参数键值',
      rules: 'required',
    },
    {
      component: 'RadioGroup',
      fieldName: 'status',
      label: '状态',
      defaultValue: 0,
      componentProps: {
        isButton: true,
        options: [
          { label: '已启用', value: 1 },
          { label: '已禁用', value: 2 },
        ],
      },
      dependencies: {
        disabled: (values) => {
          return values.is_default == 1;
        },
        triggerFields: ['config_key'],
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
