<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';

import { ref } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { IconifyIcon, Plus } from '@vben/icons';
import { $t } from '@vben/locales';

import { MenuBadge } from '@vben-core/menu-ui';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteMenu,
  fetchMenuTreeListAll,
  SystemMenuApi,
} from '#/api/basis/system/menu';
import { useLoading } from '#/components/loading';
import { notification } from '#/components/message/useMessage';
import { preserveVxeTableTreeState } from '#/utils/vxeTableHelper';

import { useColumns } from './data';
import Form from './modules/form.vue';

const isExpand = ref(false);

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [Grid, gridApi] = useVbenVxeGrid({
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
          return await fetchMenuTreeListAll(null);
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
    /**
     * 开启虚拟滚动
     * 数据量小可以选择关闭
     * 如果遇到样式问题(空白、错位 滚动等)可以选择关闭虚拟滚动
     */
    scrollY: {
      enabled: true,
      gt: 0,
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: { code: 'query' },
      zoom: true,
    },
    treeConfig: {
      parentField: 'parent_id',
      rowField: 'id',
      transform: false,
    },
  } as VxeTableGridOptions,
});

function onActionClick({
  code,
  row,
}: OnActionClickParams<SystemMenuApi.SystemMenu>) {
  switch (code) {
    case 'append': {
      onAppend(row);
      break;
    }
    case 'delete': {
      onDelete(row);
      break;
    }
    case 'edit': {
      onEdit(row);
      break;
    }
    default: {
      break;
    }
  }
}

async function onRefresh() {
  await preserveVxeTableTreeState(gridApi, () => gridApi.query());
}
function onEdit(row: SystemMenuApi.SystemMenu) {
  formDrawerApi.setData(row).open();
}
function onCreate() {
  formDrawerApi.setData({}).open();
}
function onAppend(row: SystemMenuApi.SystemMenu) {
  formDrawerApi.setData({ parent_id: row.id }).open();
}

async function onDelete(row: SystemMenuApi.SystemMenu) {
  try {
    useLoading.show($t('ui.actionMessage.deleting', [row.name]));
    await deleteMenu(row.id).then(() => {
      notification.success($t('ui.actionMessage.deleteSuccess', [row.name]));
      onRefresh();
    });
  } finally {
    useLoading.hide();
  }
}
/**
 * 全部展开/折叠
 * @param expand 是否展开
 */
function setExpandOrCollapse(expand: boolean) {
  gridApi.grid?.setAllTreeExpand(expand);
}
</script>
<template>
  <Page auto-content-height>
    <FormDrawer @success="onRefresh" />
    <Grid table-title="菜单列表">
      <template #toolbar-tools>
        <Button
          class="mr-2"
          @click="setExpandOrCollapse((isExpand = !isExpand))"
        >
          {{ isExpand === false ? '展开' : '收起' }}
        </Button>
        <Button
          type="primary"
          @click="onCreate"
          v-access:code="['system:menu:add']"
        >
          <Plus class="size-5" />新增菜单
        </Button>
      </template>
      <template #title="{ row }">
        <div class="flex w-full items-center gap-1">
          <div class="size-5 flex-shrink-0">
            <IconifyIcon
              v-if="row.type === 'button'"
              icon="carbon:security"
              class="size-full"
            />
            <IconifyIcon
              v-else-if="row.meta?.icon"
              :icon="row.meta?.icon || 'carbon:circle-dash'"
              class="size-full"
            />
          </div>
          <span class="flex-auto">{{ $t(row.meta?.title) }}</span>
          <div class="items-center justify-end"></div>
        </div>
        <MenuBadge
          v-if="row.meta?.badgeType"
          class="menu-badge"
          :badge="row.meta.badge"
          :badge-type="row.meta.badgeType"
          :badge-variants="row.meta.badgeVariants"
        />
      </template>
    </Grid>
  </Page>
</template>
<style lang="scss" scoped>
// .menu-badge {
//   top: 50%;
//   right: 0;
//   transform: translateY(-50%);

//   & > :deep(div) {
//     padding-top: 0;
//     padding-bottom: 0;
//   }
// }
</style>
