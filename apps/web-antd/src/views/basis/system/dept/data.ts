import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn } from '#/adapter/vxe-table';
import type { SystemPostApi } from '#/api';
import type { SystemDeptApi } from '#/api/basis/system/dept';
import { OrgTypeEnum } from '#/enums/systemEnums';
import { useAccess } from '@vben/access';

import { z } from '#/adapter/form';
import { fetchDeptAllTree } from '#/api/basis/system/dept';
import { fetchUserListAll } from '#/api/basis/system/user';

const { hasAccessByCodes } = useAccess();

/**
 * 获取编辑表单的字段配置。如果没有使用多语言，可以直接export一个数组常量
 */
export function useSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '部门名称',
      rules: z
        .string()
        .min(2, '部门名称至少2个字符')
        .max(20, '部门名称最多20个字符'),
    },
    {
      component: 'ApiTreeSelect',
      componentProps: {
        allowClear: true,
        // api: fetchDeptAllTree,
        // class: 'w-full', // 宽度100%
      //   labelField: 'name',
      //   valueField: 'id',
      //   childrenField: 'children',
      //  afterFetch: (data: any, data2: any) => {
      //     console.log("===>",data, data2);
      //     return data;
      //   },
      },
      fieldName: 'parent_id',
      label: '上级部门',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterable: true,
        options: OrgTypeEnum,
        placeholder: '请选择部门类型',
        class: 'w-full',
      },
      fieldName: 'org_type',
      label: '类型',
    },
    {
      component: 'ApiSelect',
      componentProps: {
        allowClear: true,
        filterable: true,
        mode: "multiple",
        showSearch: true,
        afterFetch: (data: { id: string; nickname: string }[]) => {
          return data.map((item: any) => ({
            label: item.nickname,
            value: item.id,
          }));
        },
        api: fetchUserListAll,
        class: 'w-full',
      },
      fieldName: 'dept_leader_user_ids',
      label: '部门领导',
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
      component: 'RadioGroup',
      fieldName: 'status',
      label: '状态',
      defaultValue: 1,
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
      componentProps: {
        maxLength: 50,
        rows: 3,
        showCount: true,
      },
      fieldName: 'remarks',
      label: '备注',
      rules: z.string().max(50, '备注最多50个字符').optional(),
    },
  ];
}

/**
 * 获取表格列配置
 * @description 使用函数的形式返回列数据而不是直接export一个Array常量，是为了响应语言切换时重新翻译表头
 * @param onActionClick 表格操作按钮点击事件
 */
export function useColumns(
  onActionClick?: OnActionClickFn<SystemDeptApi.SystemDept>,
  onStatusChange?: (
    newStatus: any,
    row: SystemDeptApi.SystemDept,
  ) => PromiseLike<boolean | undefined>,
): VxeTableGridOptions<SystemDeptApi.SystemDept>['columns'] {
  return [
    {
      align: 'left',
      field: 'name',
      fixed: 'left',
      title: '部门名称',
      treeNode: true,
      width: 300,
    },
    {
      align: 'left',
      field: 'orgTypeText',
      fixed: 'left',
      title: '部门类型',
      width: 100,
    },
    {
      cellRender: {
        attrs: {
          beforeChange: onStatusChange,
          hasAccessByCodes: ['system:dept:edit'],
        },
        name: 'CellSwitch',
      },
      field: 'status',
      title: '状态',
      width: 100,
    },
    {
      align: 'left',
      field: 'leader',
      title: '部门领导',
      width: 300,
      showFooterOverflow: true,
    },
    {
      field: 'created_time',
      title: '创建时间',
      width: 180,
    },
    {
      field: 'remarks',
      title: '备注',
    },
    {
      align: 'right',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: '部门',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'tree_org',
            text: '查看组织图谱',
          },
          {
            code: 'append',
            text: '新增下级',
            show: hasAccessByCodes(['system:dept:add']),
          },
          {
            code: 'add_post',
            text: '关联岗位',
          },
          {
            code: 'edit',
            show: hasAccessByCodes(['system:dept:edit']),
          },
          {
            code: 'delete', // 默认的删除按钮
            show: hasAccessByCodes(['system:dept:delete']),
            disabled: (row: SystemDeptApi.SystemDept) => {
              return !!(row.children && row.children.length > 0);
            },
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      headerAlign: 'center',
      showOverflow: false,
      title: '操作',
      width: 200,
    },
  ];
}

// 部门岗位
export function useDeptPostSchema<T = SystemPostApi.SystemPost>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'name',
      title: '岗位名称',
      width: 200,
    },
    {
      field: 'post_code',
      title: '岗位编码',
      width: 200,
    },
    {
      cellRender: {
        name: 'CellTag',
      },
      field: 'status',
      title: '状态',
      width: 200,
    },
    {
      field: 'remarks',
      minWidth: 100,
      title: '备注',
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
            code: 'delete',
            text: '移除岗位',
            // show: hasAccessByCodes(['system:dept:post:delete']),
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

export function useAddDeptPostFormSchema(): VbenFormSchema[] {
  return [
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
      defaultValue: 1,
      fieldName: 'status',
      label: '状态',
      labelWidth: 30,
    },
  ];
}

export function useAddDeptPostSchema(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'checkbox',
      type: 'checkbox',
      width: 80,
    },
    {
      field: 'name',
      title: '岗位名称',
      width: 200,
    },
    {
      field: 'post_code',
      title: '岗位编码',
      width: 200,
    },
    {
      cellRender: {
        name: 'CellTag',
      },
      field: 'status',
      title: '状态',
      width: 200,
    },
    {
      field: 'remarks',
      minWidth: 100,
      title: '备注',
    },
  ];
}
