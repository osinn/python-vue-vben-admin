<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SystemPostApi } from '#/api';

import { confirm, Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  changePostStatus,
  deletePost,
  fetchPostList,
} from '#/api/basis/system/post';
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
    fieldMappingTime: [['createdTime', ['startTime', 'endTime']]],
    schema: useGridFormSchema(),
    // 是否在字段值改变时提交表单
    submitOnChange: false,
  },
  gridOptions: {
    columns: useColumns(onActionClick, onStatusChange),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await fetchPostList({
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
      export: false,
      refresh: { code: 'query' },
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<SystemPostApi.SystemPost>,
});

function onActionClick(e: OnActionClickParams<SystemPostApi.SystemPost>) {
  switch (e.code) {
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

/**
 * 状态开关即将改变
 * @param newStatus 期望改变的状态值
 * @param row 行数据
 * @returns 返回false则中止改变，返回其他值（undefined、true）则允许改变
 */
async function onStatusChange(
  newStatus: string,
  row: SystemPostApi.SystemPost,
) {
  const status: Recordable<string> = {
    1: '启用',
    2: '禁用',
  };
  try {
    // await messageBox.confirm(
    //   `你要将${row.name}的状态切换为 【${status[newStatus.toString()]}】 吗？`,
    //   {
    //     type: 'warning'
    //   },
    //   `切换状态`,
    // );
    await confirm({
      title: '切换状态',
      centered: false,
      content: `你要将【${row.name}】的状态切换为 【${status[newStatus.toString()]}】 吗？`,
      icon: 'question',
    });
    await changePostStatus({ id: row.id, status: newStatus });
    notification.success(`${row.name} 状态设置成功`);
    return true;
  } catch {
    return false;
  }
}

function onEdit(row: SystemPostApi.SystemPost) {
  formDrawerApi.setData(row).open();
}

async function onDelete(row: SystemPostApi.SystemPost) {
  try {
    useLoading.show(`${row.name} 删除成功`);
    await deletePost(row.id).then(() => {
      notification.success(`${row.name} 删除成功`);
      onRefresh();
    });
  } finally {
    useLoading.hide();
  }
}

function onRefresh() {
  gridApi.query();
}

function onCreate() {
  formDrawerApi.setData({}).open();
}
</script>
<template>
  <Page auto-content-height>
    <FormDrawer @success="onRefresh" />
    <Grid table-title="岗位列表">
      <template #toolbar-tools>
        <Button
          type="primary"
          @click="onCreate"
          v-access:code="['system:post:add']"
        >
          <Plus class="size-5" />新增岗位
        </Button>
      </template>
    </Grid>
  </Page>
</template>

<style scoped>
.row--hover {
  background-color: var(--vben-color-bg-1);
}
</style>
