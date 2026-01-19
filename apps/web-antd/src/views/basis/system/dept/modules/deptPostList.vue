<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SystemDeptApi, SystemPostApi } from '#/api';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteDeptPost,
  getDeptPostListByDeptId,
} from '#/api/basis/system/post';
import { useLoading } from '#/components/loading';
import { notification } from '#/components/message/useMessage';

import { useDeptPostSchema } from '../data';
import DeptPostForm from './deptPostForm.vue';

const formData = ref<SystemDeptApi.SystemDept>();

const dept_id = ref();

const [Modal, modalApi] = useVbenModal({
  draggable: true,
  destroyOnClose: true,
  showCancelButton: false,
  showConfirmButton: false,
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<SystemDeptApi.SystemDept>();
      if (data) {
        formData.value = data;
        dept_id.value = data.id;
      }
    }
  },
});
const [DeptPostFormModal, deptPostFormModalApi] = useVbenModal({
  connectedComponent: DeptPostForm,
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useDeptPostSchema(onActionClick),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getDeptPostListByDeptId({
            page_num: page.currentPage,
            page_size: page.pageSize,
            dept_id: dept_id.value,
            checked: true,
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
      custom: false,
      export: false,
      refresh: { code: 'query' },
      search: false,
      zoom: false,
    },
  } as VxeTableGridOptions<SystemPostApi.SystemPost>,
});

/**
 * 表格操作按钮的回调函数
 */
function onActionClick({
  code,
  row,
}: OnActionClickParams<SystemPostApi.SystemPost>) {
  switch (code) {
    case 'delete': {
      onDelete(row);
      break;
    }
  }
}

async function onDelete(row: SystemPostApi.SystemPost) {
  try {
    useLoading.show(`正在移除 ${row.name}`);
    await deleteDeptPost({ dept_id: dept_id.value, post_ids: [row.id] }).then(
      () => {
        notification.success(`岗位 ${row.name} 移除成功`);
        onRefresh();
      },
    );
  } finally {
    useLoading.hide();
  }
}

function onRefresh() {
  gridApi.query();
}

function onCreate() {
  deptPostFormModalApi.setData(formData.value).open();
}

const getTitle = computed(() => {
  return `部门【${formData.value?.name}】岗位管理`;
});
</script>
<template>
  <Modal :title="getTitle" class="w-[900px]">
    <DeptPostFormModal @success="onRefresh" />
    <Grid table-title="部门岗位列表">
      <template #toolbar-tools>
        <Button
          type="primary"
          @click="onCreate"
          v-access:code="['system:dept:post:add']"
        >
          <Plus class="size-5" />添加岗位
        </Button>
      </template>
    </Grid>
  </Modal>
</template>
