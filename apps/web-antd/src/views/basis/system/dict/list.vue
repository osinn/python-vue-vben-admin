<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SystemDictApi } from '#/api';

import { confirm, Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  changeStatus,
  deleteDict,
  fetchDictList,
} from '#/api/basis/system/dict';
import { useLoading } from '#/components/loading';
import { notification } from '#/components/message/useMessage';

import { useColumns, useGridFormSchema } from './data';
import DictItemList from './modules/dictItemList.vue';
import Form from './modules/form.vue';

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: DictItemList,
  destroyOnClose: true,
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
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
          return await fetchDictList({
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
  } as VxeTableGridOptions<SystemDictApi.SystemDict>,
});

function onActionClick(e: OnActionClickParams<SystemDictApi.SystemDict>) {
  switch (e.code) {
    case 'append': {
      onAppend(e.row);
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

/**
 * 状态开关即将改变
 * @param newStatus 期望改变的状态值
 * @param row 行数据
 * @returns 返回false则中止改变，返回其他值（undefined、true）则允许改变
 */
async function onStatusChange(
  newStatus: string,
  row: SystemDictApi.SystemDict,
) {
  const status: Recordable<string> = {
    1: '启用',
    2: '禁用',
  };
  try {
    await confirm({
      title: '切换状态',
      centered: false,
      content: `你要将【${row.dict_name}】的状态切换为 【${status[newStatus.toString()]}】 吗？`,
      icon: 'question',
    });
    await changeStatus({ id: row.id, status: newStatus });
    notification.success(`${row.dict_name} 状态设置成功`);
    return true;
  } catch {
    return false;
  }
}

/**
 * 添加字典项
 * @param row
 */
function onAppend(row: SystemDictApi.SystemDict) {
  formModalApi.setData(row).open();
}

function onEdit(row: SystemDictApi.SystemDict) {
  formDrawerApi.setData(row).open();
}

async function onDelete(row: SystemDictApi.SystemDict) {
  try {
    useLoading.show(`${row.dict_name} 删除成功`);
    await deleteDict(row.id).then(() => {
      notification.success(`${row.dict_name} 删除成功`);
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
    <FormModal />
    <Grid table-title="字典列表">
      <template #toolbar-tools>
        <Button
          type="primary"
          @click="onCreate"
          v-access:code="['system:dict:add']"
        >
          <Plus class="size-5" />新增字典
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
