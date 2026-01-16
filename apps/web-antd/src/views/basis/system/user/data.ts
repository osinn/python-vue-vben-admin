import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemUserApi } from '#/api';

import { useAccess } from '@vben/access';
import { z } from '@vben/common-ui';

import { SexEnum, StatusEnum } from '#/enums/systemEnums';

const { hasAccessByCodes } = useAccess();

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'id',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
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
      fieldName: 'account',
      label: '账号',
      component: 'Input',
      rules: 'required',
      componentProps: {
        placeholder: '请输入账号',
      },
      dependencies: {
        disabled: (values) => values.id,
        triggerFields: ['id'],
      },
    },
    {
      fieldName: 'nickname',
      label: '昵称',
      component: 'Input',
      rules: 'required',
      componentProps: {
        placeholder: '请输入用户昵称',
      },
    },
    {
      component: 'VbenInputPassword',
      dependencies: {
        show: (values) => !values.id,
        triggerFields: ['id'],
      },
      componentProps: {
        passwordStrength: true,
        placeholder: '请输入密码',
      },
      fieldName: 'password',
      label: '密码',
      renderComponentContent() {
        return {
          strengthText: () => '使用 8 个或更多字符，混合字母、数字和符号',
        };
      },
      rules: z.string().min(1, { message: '请输入密码' }),
    },
    {
      component: 'TreeSelect',
      fieldName: 'dept_id',
      label: '所属部门',
      componentProps: {
        class: 'w-full',
      },
    },
    {
      component: 'Select',
      componentProps: {
        class: 'w-full',
        mode: 'multiple',
        clearable: true,
        options: [],
        placeholder: '请选择部门',
      },
      fieldName: 'post_ids',
      label: '岗位',
      help: '请先选择部门, 自动加载该部门下所有的岗位',
    },
    {
      component: 'Select',
      componentProps: {
        class: 'w-full',
        mode: 'multiple',
        clearable: true,
        options: [],
        placeholder: '请选择角色',
      },
      fieldName: 'role_ids',
      label: '角色',
    },
    {
      component: 'RadioGroup',
      fieldName: 'status',
      label: '状态',
      defaultValue: StatusEnum[0]?.value,
      dependencies: {
        triggerFields: ['is_default'],
        disabled(values) {
          return values.is_default == 1;
        },
      },
      componentProps: {
        isButton: true,
        options: StatusEnum,
      },
    },
    {
      component: 'RadioGroup',
      fieldName: 'sex',
      label: '性别',
      defaultValue: SexEnum[0]?.value,
      rules: 'required',
      componentProps: {
        isButton: true,
        options: [SexEnum[0], SexEnum[1]],
      },
    },
    {
      fieldName: 'email',
      label: '邮箱',
      component: 'Input',
      componentProps: {
        placeholder: '请输入邮箱',
      },
    },
    {
      fieldName: 'phone',
      label: '手机号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入手机号',
      },
    },
    {
      fieldName: 'staff_number',
      label: '工号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入工号',
      },
    },
    {
      fieldName: 'birthday',
      label: '生日',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择生日',
        valueFormat: 'YYYY-MM-DD',
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
        class: 'w-full',
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
        placeholder: '请输入用户昵称/账号/手机号/工号/邮箱',
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
          { label: '男', value: 1 },
          { label: '女', value: 2 },
          { label: '未知', value: 3 },
        ],
        placeholder: '请选择性别',
      },
      fieldName: 'sex',
      label: '性别',
    },
  ];
}

export function useColumns<T = SystemUserApi.SystemUser>(
  onActionClick: OnActionClickFn<T>,
  onStatusChange?: (newStatus: any, row: T) => PromiseLike<any | undefined>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'avatar',
      title: '头像',
      width: 100,
      cellRender: { name: 'avatarCellRender' },
    },
    {
      field: 'nickname',
      title: '昵称',
      width: 150,
    },
    {
      field: 'account',
      title: '账号',
      width: 150,
    },
    {
      cellRender: {
        attrs: {
          beforeChange: onStatusChange,
          hasAccessByCodes: ['system:user:edit'],
          disabled: (row: SystemUserApi.SystemUser) => {
            return row.is_default == 1;
          },
        },
        name: 'CellSwitch',
      },
      field: 'status',
      title: '状态',
      width: 100,
    },
    {
      field: 'is_default',
      minWidth: 120,
      title: '系统内置',
      cellRender: {
        name: 'CellTag',
        options: [
          { color: 'processing', label: '否', value: 2 },
          { color: 'red', label: '是', value: 1 },
        ],
      },
      titlePrefix: {
        content: `系统内置用户不允许删除、修改状态`,
      },
    },
    {
      field: 'dept_name',
      minWidth: 150,
      title: '所属部门',
    },
    {
      field: 'role_names',
      minWidth: 150,
      title: '所属角色',
    },
    {
      field: 'post_names',
      minWidth: 150,
      title: '所属岗位',
    },
    {
      field: 'phone',
      minWidth: 150,
      title: '手机号',
    },
    {
      field: 'staff_number',
      minWidth: 150,
      title: '工号',
    },
    {
      field: 'email',
      minWidth: 150,
      title: '邮箱',
    },
    {
      field: 'birthday',
      minWidth: 150,
      title: '生日',
    },
    {
      field: 'sex',
      minWidth: 100,
      title: '性别',
      cellRender: {
        name: 'CellTag',
        options: [
          { color: 'cyan', label: '男', value: 1 },
          { color: 'magenta', label: '女', value: 2 },
          { color: 'red', label: '未知', value: 3 },
        ],
      },
    },
    {
      field: 'sort',
      minWidth: 100,
      title: '排序号',
    },
    {
      field: 'remarks',
      minWidth: 150,
      title: '备注',
    },
    {
      field: 'created_time',
      title: '创建时间',
      width: 200,
    },
    {
      field: 'created_by_name',
      title: '创建人',
      width: 150,
    },
    {
      field: 'updated_time',
      title: '更新时间',
      width: 200,
    },
    {
      field: 'updated_by_name',
      title: '更新人',
      width: 150,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'nickname',
          nameTitle: '用户',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            text: '重置密码',
            code: 'resetPassword',
            show: hasAccessByCodes(['system:user:resetPwd']),
          },
          {
            code: 'edit',
            show: hasAccessByCodes(['system:user:edit']),
          },
          {
            code: 'delete',
            show: hasAccessByCodes(['system:user:delete']),
            disabled: (row: SystemUserApi.SystemUser) => {
              return row.isDefault;
            },
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 240,
    },
  ];
}
