<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SysHttpLogApi } from '#/api';

import { Page, useVbenDrawer } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getSysHttpLogList } from '#/api/basis/monitor/sysHttpLog';

import { useColumns, useGridFormSchema } from './data';
import OpenLogDrawer from './modules/openLogDrawer.vue';

const [OperLogDrawer, operLogDrawerApi] = useVbenDrawer({
  connectedComponent: OpenLogDrawer,
});

/**
 * 表格操作按钮的回调函数
 */
function onActionClick({
  code,
  row,
}: OnActionClickParams<SysHttpLogApi.SysHttpLog>) {
  switch (code) {
    case 'append': {
      onAppend(row);
      break;
    }
  }
}

function onAppend(row: SysHttpLogApi.SysHttpLog) {
  operLogDrawerApi.setData(row).open();
}

const [Grid] = useVbenVxeGrid({
  gridEvents: {},
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
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getSysHttpLogList({
            pageNum: page.currentPage,
            pageSize: page.pageSize,
            logType: 'LOGIN',
            ...formValues,
          });
        },
      },
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: { code: 'query' },
      zoom: false,
    },
    treeConfig: {
      parentField: 'parentId',
      rowField: 'id',
      transform: false,
    },
  } as VxeTableGridOptions,
});
</script>
<template>
  <Page auto-content-height>
    <OperLogDrawer />
    <Grid table-title="用户登录日志列表" />
  </Page>
</template>
