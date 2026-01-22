<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SysConfigApi } from '#/api/basis/system/sysConfig';
import type { JobApi } from '#/api/scheduler/job/jobApi';

import { confirm, Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getJobSchedulerList,
  pauseJobScheduler,
  resumeJobScheduler
} from '#/api/scheduler/job/jobApi';
import { useLoading } from '#/components/loading';
import { notification } from '#/components/message/useMessage';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    fieldMappingTime: [
      [
        'created_time',
        ['start_created_time', 'end_created_time'],
        ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59'],
      ],
    ],
    schema: useGridFormSchema(),
    // 是否在字段值改变时提交表单
    submitOnChange: false,
  },
  gridOptions: {
    columns: useColumns(onActionClick, onStatusChange),
    height: 'auto',
    keepSource: true,
    pagerConfig: {
      enabled: true,
    },
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getJobSchedulerList({
            page_num: page.currentPage,
            page_size: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    stripe: true, // 斑马线条纹
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },

    toolbarConfig: {
      custom: true,
      export: true,
      refresh: { code: 'query' },
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<JobApi.Job>,
});

function onActionClick(e: OnActionClickParams<JobApi.Job>) {
  console.log('onActionClick', e);  
  switch (e.code) {
    case 'pauseJobScheduler': {
      onPauseJobScheduler(e.row);
      break;
    }
    case 'resumeJobScheduler': {
      onResumeJobScheduler(e.row);
      break;
    }
    case 'delete': {
      onDelete(e.row);
      break;
    }
    case 'edit': {
      onEdit(e.row);
      break;
    }
  }
}

async function onPauseJobScheduler(row: JobApi.Job) {
  try {
    useLoading.show(`正在暂停任务调度...`);
    await pauseJobScheduler(row.id).then(() => {
      notification.success(`任务调度暂停成功`);
      onRefresh();
    });
  } finally {
    useLoading.hide();
  }
}

async function onResumeJobScheduler(row: JobApi.Job) {
  try {
    useLoading.show(`正在恢复任务调度...`);
    await resumeJobScheduler(row.id).then(() => {
      notification.success(`任务调度恢复成功`);
      onRefresh();
    });
  } finally {
    useLoading.hide();
  }
}

/**
 * 状态开关即将改变
 * @param newStatus 期望改变的状态值
 * @param row 行数据
 * @returns 返回false则中止改变，返回其他值（undefined、true）则允许改变
 */
async function onStatusChange(newStatus: number, row: JobApi.Job) {
  const status: Recordable<string> = {
    1: '启用',
    2: '禁用',
  };
  // try {
  //   await confirm({
  //     title: '切换状态',
  //     centered: false,
  //     content: `你要将【${row.config_name}】的状态设置为 【${status[newStatus]}】 吗？`,
  //     icon: 'question',
  //   });
  //   await changeSysConfigStatus({ id: row.id, status: newStatus });
  //   notification.success(`${row.config_name} 状态设置成功`);
  //   onRefresh();
  //   return true;
  // } catch {
  //   return false;
  // }
}
function onEdit(row: JobApi.Job) {
  formDrawerApi.setData(row).open();
}

async function onDelete(row: JobApi.Job) {
  // try {
  //   useLoading.show(`${row.config_name} 删除成功`);
  //   await deleteSysConfig(row.id).then(() => {
  //     notification.success(`${row.config_name} 删除成功`);
  //     onRefresh();
  //   });
  // } finally {
  //   useLoading.hide();
  // }
}

function onRefresh() {
  gridApi.query();
}

function onCreate() {
  notification.warning(`暂不支持动态添加任务调度，正在努力开发中，敬请期待...`);
  // formDrawerApi.setData({}).open();
}
</script>
   <!-- v-access:code="['scheduler:job:add']" -->
<template>
  <Page auto-content-height>
    <FormDrawer @success="onRefresh" />
    <Grid table-title="任务列表">
      <template #toolbar-tools>
        <Button
          type="primary"
          @click="onCreate"
       
        >
          <Plus class="size-5" />新增任务调度
        </Button>
      </template>
    </Grid>
  </Page>
</template>

<style scoped></style>
