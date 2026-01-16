<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SystemDeptApi } from '#/api/basis/system/dept';

import { ref } from 'vue';

import { confirm, Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  changeDeptStatus,
  deleteDept,
  fetchDeptAllTree,
} from '#/api/basis/system/dept';
import { useLoading } from '#/components/loading';
import { notification } from '#/components/message/useMessage';

import { useColumns } from './data';
import DeptPostList from './modules/deptPostList.vue';
import Form from './modules/form.vue';
import TreeOrg from './modules/treeOrg.vue';

const isExpand = ref(false);

const [TreeOrgModal, treeOrgModalApi] = useVbenModal({
  connectedComponent: TreeOrg,
  destroyOnClose: true,
});

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [DeptPostListModal, dptPostModalApi] = useVbenModal({
  connectedComponent: DeptPostList,
  destroyOnClose: true,
});

function onTreeOrg(row: SystemDeptApi.SystemDept) {
  treeOrgModalApi.setData(row).open();
}

/**
 * 编辑部门
 * @param row
 */
function onEdit(row: SystemDeptApi.SystemDept) {
  formModalApi.setData(row).open();
}

/**
 * 添加下级部门
 * @param row
 */
function onAppend(row: SystemDeptApi.SystemDept) {
  formModalApi.setData({ parentId: row.id }).open();
}

/**
 * 创建新部门
 */
function onCreate() {
  formModalApi.setData(null).open();
}

/**
 * 删除部门
 * @param row
 */
async function onDelete(row: SystemDeptApi.SystemDept) {
  try {
    useLoading.show(`${row.name} 删除成功`);
    await deleteDept(row.id).then(() => {
      notification.success(`${row.name} 删除成功`);
      refreshGrid();
    });
  } finally {
    useLoading.hide();
  }
}

/**
 * 部门关联岗位
 */
function onAddPost(row: SystemDeptApi.SystemDept) {
  dptPostModalApi.setData(row).open();
}

/**
 * 表格操作按钮的回调函数
 */
function onActionClick({
  code,
  row,
}: OnActionClickParams<SystemDeptApi.SystemDept>) {
  switch (code) {
    case 'addPost': {
      onAddPost(row);
      break;
    }
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
    case 'treeOrg': {
      onTreeOrg(row);
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
  row: SystemDeptApi.SystemDept,
) {
  const status: Recordable<string> = {
    DISABLE: '已禁用',
    ENABLE: '已启用',
  };
  try {
    await confirm({
      title: '切换状态',
      centered: false,
      content: `你要将【${row.name}】的状态切换为 【${status[newStatus.toString()]}】 吗？`,
      icon: 'question',
    });
    await changeDeptStatus({ id: row.id, status: newStatus });
    return true;
  } catch {
    return false;
  }
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridEvents: {},
  gridOptions: {
    columns: useColumns(onActionClick, onStatusChange),
    height: 'auto',
    keepSource: true,
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      ajax: {
        query: async (_params) => {
          return await fetchDeptAllTree();
        },
      },
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: { code: 'query' },
      zoom: true,
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
function refreshGrid() {
  gridApi.query();
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
    <TreeOrgModal />
    <DeptPostListModal />
    <FormModal @success="refreshGrid" />
    <Grid table-title="部门列表">
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
          v-access:code="['system:dept:add']"
        >
          <Plus class="size-5" />
          新增部门
        </Button>
      </template>
    </Grid>
  </Page>
</template>
