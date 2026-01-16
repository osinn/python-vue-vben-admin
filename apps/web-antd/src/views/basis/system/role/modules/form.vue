<script lang="ts" setup>
import type { SystemRoleApi } from '#/api/basis/system/role';

import { computed, ref } from 'vue';

import { Page, useVbenDrawer, Tree as VbenTree } from '@vben/common-ui';
import { EllipsisVertical, IconifyIcon } from '@vben/icons';

import { Dropdown, Menu, MenuItem } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { fetchMenuTreeListAll } from '#/api/basis/system/menu';
import { createRole, updateRole } from '#/api/basis/system/role';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emit = defineEmits<{
  success: [];
}>();

const treeRef = ref(); // 全选状态

const formData = ref<SystemRoleApi.SystemRole>();

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
});

const permissions = ref<any[]>([]);
const loadingPermissions = ref(false);
const isAdminRole = ref(false);

const id = ref();
const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    drawerApi.lock();
    (id.value ? updateRole(id.value, values) : createRole(values))
      .then(() => {
        drawerApi.close();
        emit('success');
      })
      .catch(() => {
        drawerApi.unlock();
      });
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<SystemRoleApi.SystemRole>();
      formApi.resetForm();
      if (data) {
        formData.value = data;
        id.value = data.id;
        setTimeout(() => {
          formApi.setValues(data);
          isAdminRole.value = data.role_code === 'admin';
        }, 500);
      } else {
        id.value = undefined;
      }

      if (permissions.value.length === 0) {
        loadPermissions();
      }
    }
  },
});

async function loadPermissions() {
  loadingPermissions.value = true;
  try {
    const res = await fetchMenuTreeListAll({ status: 1 });
    permissions.value = res as unknown as [];
  } finally {
    loadingPermissions.value = false;
  }
}

const getDrawerTitle = computed(() => {
  return formData.value?.id ? '编辑角色' : '新增角色';
});

/**
 *  递归获取所有节点 ID
 */
function getAllNodeIds(nodes: any[], ids: number[] = []): number[] {
  nodes.forEach((node: any) => {
    ids.push(node.id);
    if (node.children && node.children.length > 0) {
      getAllNodeIds(node.children, ids);
    }
  });
  return ids;
}

/**
 * 全选
 */
function toggleSelectAll() {
  const allIds = getAllNodeIds(permissions.value);
  formApi.setFieldValue('permissions', allIds);
}
/**
 * 全不选
 */
function toggleNotSelectAll() {
  formApi.setFieldValue('permissions', []);
}

/**
 * 全部折叠
 */
function collapseAll() {
  treeRef.value[0].collapseAll(true);
}

/**
 * 全部展开
 */
function expandAll() {
  treeRef.value[0].expandAll(true);
}
</script>
<template>
  <Drawer :title="getDrawerTitle">
    <Form>
      <template #permissions="slotProps">
        <Page
          v-access:code="['system:permission:assignment']"
          class="permissions"
          style="width: 100%; height: 100%; padding: 0 !important"
        >
          <template #title>
            <div class="flex items-center">
              <span class="text-lg font-semibold">权限分配 </span>
              <Dropdown>
                <span>
                  <EllipsisVertical class="size-5" />
                </span>
                <template #overlay>
                  <Menu>
                    <MenuItem @click="toggleSelectAll" :disabled="isAdminRole">
                      选择全部
                    </MenuItem>
                    <MenuItem
                      @click="toggleNotSelectAll"
                      :disabled="isAdminRole"
                    >
                      取消选择
                    </MenuItem>
                    <MenuItem @click="expandAll">展开全部</MenuItem>
                    <MenuItem @click="collapseAll"> 折叠全部 </MenuItem>
                  </Menu>
                </template>
              </Dropdown>
            </div>
          </template>
          <!-- 把disabled 放到 v-bind 这行的下面，不然不起作用 -->
          <VbenTree
            ref="treeRef"
            :tree-data="permissions"
            multiple
            bordered
            :default-expanded-level="2"
            v-bind="slotProps"
            :disabled="isAdminRole"
            value-field="id"
            label-field="meta.title"
            icon-field="meta.icon"
          >
            <template #node="{ value }">
              <IconifyIcon v-if="value.meta.icon" :icon="value.meta.icon" />
              {{ $t(value.meta.title) }}
            </template>
          </VbenTree>
        </Page>
      </template>
    </Form>
  </Drawer>
</template>
<style lang="css" scoped>
/* :deep(.ant-tree-title) {
  .tree-actions {
    display: none;
    margin-left: 20px;
  }
}

:deep(.ant-tree-title:hover) {
  .tree-actions {
    display: flex;
    flex: auto;
    justify-content: flex-end;
    margin-left: 20px;
  }
} */

/* px-6 py-4 */
.permissions :deep(.px-6, .py-4, .text-lg) {
  padding: 0 !important;
  font-size: 14px !important;
}

.permissions {
  .menu-vertical {
    cursor: pointer;
  }
}
</style>
