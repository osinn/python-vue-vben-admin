import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { JobApi } from '#/api/scheduler/job/jobApi';
import { formatDateTime } from '@vben/utils';
import { useAccess } from '@vben/access';

import { getSysConfigGroupNameListAll } from '#/api/basis/system/sysConfig';
import type { message } from 'ant-design-vue';

const { hasAccessByCodes } = useAccess();

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'search_key',
      label: '搜索关键字',
      componentProps: {
        allowClear: true,
        placeholder: '请输入搜索关键字：任务key唯一标识/备注/作者/调用函数名称/报警邮件',
      },
    }
  ];
}
export function useColumns<T = JobApi.Job>(
  onActionClick: OnActionClickFn<T>,
  onStatusChange?: (newStatus: any, row: T) => PromiseLike<any | undefined>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'job_id',
      title: '任务key唯一标识',
    },
    {
      cellRender: {
        name: 'CellTag',
        options: [
          { color: 'processing', label: 'date', value: 1 },
          { color: 'processing', label: 'interval', value: 2 },
          { color: 'processing', label: 'cron', value: 3 },
        ],
      },
      field: 'trigger_type',
      title: '触发器类型',
      width: 120,
    },
    {
      cellRender: {
        name: 'CellTag',
        options: [
          { color: 'processing', label: '运行', value: 1 },
          { color: 'red', label: '暂停', value: 2 }
        ],
      },
      field: 'job_status',
      title: '任务状态',
      width: 120,
    },
    {
      field: 'next_run_time',
      title: '下次执行时间',
      formatter: ({ cellValue }) => {
        console.log('next_run_time', cellValue);
        if (cellValue) {
          // 秒级时间戳转换为毫秒级并格式化显示
          return formatDateTime(cellValue * 1000);
        }
        return '';
      },
    },
    {
      field: 'trigger_condition',
      title: '触发器触发条件',
    },
    {
      field: 'author',
      title: '作者',
    },
    // {
    //   field: 'alarm_email',
    //   title: '报警邮箱',
    // },
    {
      field: 'executor_handler',
      title: '执行器处理器',
    },
    {
      field: 'executor_param',
      title: '执行器任务参数',
    },
    {
      field: 'remarks',
      title: '备注',
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'job_id',
          nameTitle: '操作',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            text: '暂停任务',
            code: 'pauseJobScheduler',
            disabled: (row: any) => {
              return row.job_status === 2;
            },
            type: 'primary',
            confirmBtn: true,
            actionTitle: '提示',
            actionMessage: `要暂停任务调度吗？`
          },
          {
            text: '继续任务',
            code: 'resumeJobScheduler',
             disabled: (row: any) => {
              return row.job_status === 1;
            },
            type: 'primary',
            confirmBtn: true,
            actionTitle: '提示',
            actionMessage: `要启动任务调度吗？`,
          }
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 240,
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
      defaultValue: 1,
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
