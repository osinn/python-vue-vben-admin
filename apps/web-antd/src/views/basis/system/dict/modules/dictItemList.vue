<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SystemDictApi, SystemDictItemApi } from '#/api';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteDictItem,
  fetchDictItemListAll,
} from '#/api/basis/system/dictItem';
import { useLoading } from '#/components/loading';
import { notification } from '#/components/message/useMessage';

import { useColumns } from '../dictItemData';
import DictItemForm from './dictItemForm.vue';

const formData = ref<SystemDictApi.SystemDict>();

const dictId = ref();

const getTitle = computed(() => {
  return formData.value?.dictName
    ? `【${formData.value?.dictName}】字典项管理`
    : '字典项管理';
});
const [Modal, modalApi] = useVbenModal({
  draggable: true,
  destroyOnClose: true,
  showCancelButton: false,
  showConfirmButton: false,
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<SystemDictApi.SystemDict>();
      if (data) {
        formData.value = data;
        dictId.value = data.id;
      }
    }
  },
});
const [DictItemModal, dictItemModalApi] = useVbenModal({
  connectedComponent: DictItemForm,
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useColumns(onActionClick),
    // height: 'auto',
    keepSource: true,
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await fetchDictItemListAll(dictId.value);
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
  } as VxeTableGridOptions<SystemDictItemApi.SystemDictItem>,
});

function onActionClick(
  e: OnActionClickParams<SystemDictItemApi.SystemDictItem>,
) {
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

function onEdit(row: SystemDictItemApi.SystemDictItem) {
  dictItemModalApi.setData(row).open();
}

async function onDelete(row: SystemDictItemApi.SystemDictItem) {
  try {
    useLoading.show(`${row.dictItemName} 删除成功`);
    await deleteDictItem(row.id).then(() => {
      notification.success(`${row.dictItemName} 删除成功`);
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
  dictItemModalApi.setData({ dictId }).open();
}
</script>
<template>
  <Modal :title="getTitle" class="w-fit">
    <!-- <Button @click="openNestedModal" type="primary">打开子弹窗</Button> -->
    <DictItemModal @success="onRefresh" />
    <Grid table-title="字典项列表">
      <template #toolbar-tools>
        <Button
          type="primary"
          @click="onCreate"
          v-access:code="['system:dictItem:add']"
        >
          <Plus class="size-5" />新增字典项
        </Button>
      </template>
    </Grid>
  </Modal>
</template>
