<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { SystemDeptApi, SystemUserApi } from '#/api';

import { ref } from 'vue';

import { confirm, Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  changeUserStatus,
  deleteUser,
  getUserList,
} from '#/api/basis/system/user';
import { useLoading } from '#/components/loading';
import { notification } from '#/components/message/useMessage';

import { useColumns, useGridFormSchema } from './data';
import DeptTree from './modules/deptTree.vue';
import Form from './modules/form.vue';
import ResetPwdForm from './modules/resetPasswordForm.vue';

const dept_id = ref<string | undefined>(undefined);

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  // destroyOnClose: true, 如果设置成关闭时销毁，第二次打开选择部门无法触发变更事件加载岗位
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    fieldMappingTime: [['created_time', ['start_time', 'end_time']]],
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
          return await getUserList({
            page_num: page.currentPage,
            page_size: page.pageSize,
            ...formValues,
            dept_id: dept_id.value,
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
  } as VxeTableGridOptions<SystemUserApi.SystemUser>,
});

function onActionClick(e: OnActionClickParams<SystemUserApi.SystemUser>) {
  switch (e.code) {
    case 'delete': {
      onDelete(e.row);
      break;
    }
    case 'edit': {
      onEdit(e.row);
      break;
    }
    case 'resetPassword': {
      onResetPassword(e.row);
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
  row: SystemUserApi.SystemUser,
) {
  const status: Recordable<string> = {
    1: '启用',
    2: '禁用',
  };
  try {
    await confirm({
      title: '切换状态',
      centered: false,
      content: `你要将【${row.nickname}】的状态切换为 【${status[newStatus.toString()]}】 吗？`,
      icon: 'question',
    });
    await changeUserStatus({ id: row.id, status: newStatus });
    return true;
  } catch {
    return false;
  }
}

function onEdit(row: SystemUserApi.SystemUser) {
  formDrawerApi.setData(row).open();
}

async function onDelete(row: SystemUserApi.SystemUser) {
  try {
    useLoading.show(`${row.nickname} 删除成功`);
    await deleteUser(row.id).then(() => {
      notification.success(`${row.nickname} 删除成功`);
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
  formDrawerApi.setData({ dept_id: dept_id.value }).open();
}

function onDeptSelect(data: null | SystemDeptApi.SystemDept) {
  dept_id.value = data?.id;
  onRefresh();
}

function onResetPassword(row: SystemUserApi.SystemUser) {
  formModalApi
    .setState({ title: `重置【${row.nickname}】密码` })
    .setData(row)
    .open();
}

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: ResetPwdForm,
});
</script>
<template>
  <Page auto-content-height>
    <FormModal />
    <FormDrawer @success="onRefresh" />
    <div class="flex h-full w-full">
      <div class="mr-4 w-1/6">
        <DeptTree @select="onDeptSelect" />
      </div>

      <div class="w-5/6">
        <Grid table-title="用户列表">
          <template #toolbar-tools>
            <Button
              type="primary"
              @click="onCreate"
              v-access:code="['system:user:add']"
            >
              <Plus class="size-5" />新增用户
            </Button>
          </template>
        </Grid>
      </div>
    </div>
  </Page>
</template>

<style scoped>
.row--hover {
  background-color: var(--vben-color-bg-1);
}
</style>
