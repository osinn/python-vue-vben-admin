<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { OnlineUserApi } from '#/api';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getOnlineUserAll,
  onlineUserOffline,
  refreshOnlineUserPermission,
} from '#/api/basis/monitor/onlineUser';
import { useLoading } from '#/components/loading';
import { notification } from '#/components/message/useMessage';

import { useColumns } from './data';

const onlineCount = ref(0);
/**
 * 在线用户下线
 * @param row
 */
async function onOnline(row: OnlineUserApi.OnlineUser) {
  try {
    useLoading.show(`${row.nickname} 正在下线...`);
    await onlineUserOffline({ ids: [row.id] }).then(() => {
      notification.success(`${row.nickname} 下线成功`);
      onRefresh();
    });
  } finally {
    useLoading.hide();
  }
}

/**
 * 刷新权限
 * @param row
 */
async function onRefreshPermission(row: OnlineUserApi.OnlineUser) {
  try {
    useLoading.show(`${row.nickname} 正在刷新权限...`);
    await refreshOnlineUserPermission({ ids: [row.id] }).then(() => {
      notification.success(`${row.nickname} 权限刷新成功`);
    });
  } finally {
    useLoading.hide();
  }
}

/**
 * 表格操作按钮的回调函数
 */
function onActionClick({
  code,
  row,
}: OnActionClickParams<OnlineUserApi.OnlineUser>) {
  switch (code) {
    case 'online': {
      onOnline(row);
      break;
    }
    case 'refreshPermission': {
      onRefreshPermission(row);
      break;
    }
  }
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridEvents: {},
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      ajax: {
        query: async (_params) => {
          const data = await getOnlineUserAll();
          onlineCount.value = data.length;
          return data;
        },
      },
    },
    toolbarConfig: {
      custom: false,
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

/**
 * 刷新表格
 */
function onRefresh() {
  gridApi.query();
}
</script>
<template>
  <Page auto-content-height>
    <Grid :table-title="`在线用户列表 (共 ${onlineCount} 人在线)`" />
  </Page>
</template>
