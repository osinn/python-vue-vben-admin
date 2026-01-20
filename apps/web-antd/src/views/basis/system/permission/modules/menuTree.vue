<script lang="ts" setup>
import type { CheckboxChangeEvent } from 'ant-design-vue/es/checkbox/interface';
import type { CheckInfo } from 'ant-design-vue/es/vc-tree/props';

import type { SystemMenuApi, SystemRoleApi } from '#/api';

import { onMounted, ref, watch } from 'vue';

import { Loading, Page } from '@vben/common-ui';
import { EllipsisVertical } from '@vben/icons';

import {
  Button,
  Checkbox,
  Dropdown,
  Input,
  Menu,
  MenuItem,
  Popconfirm,
  Tree,
} from 'ant-design-vue';

import {
  fetchAssignmentPermissionIdsByRoleId,
  fetchMenuTreeListAll,
} from '#/api/basis/system/menu';
import { assignMenu } from '#/api/basis/system/role';
import { useLoading } from '#/components/loading';
import { notification } from '#/components/message/useMessage';
import { menuTypeIcon } from '#/enums/dictEnums';
import { findRootFromNode, setNodesChecked } from '#/utils/treeUtils';

const props = defineProps({
  roleId: {
    type: String,
    default: null,
  },
  isAdminRole: {
    type: Boolean,
    default: false,
  },
});

const loadingTree = ref(true);
const filterText = ref('');
const treeRef = ref();

const deptTreeFieldNames = ref({ title: 'name', key: 'id' });

watch(filterText, (val) => {
  treeRef.value?.filter(val);
});

watch(
  () => props.isAdminRole,
  (value) => {
    if (value) {
      setNodesChecked(dataTreeList.value, [], true, 'disableCheckbox');
    } else {
      setNodesChecked(dataTreeList.value, [], false, 'disableCheckbox');
    }
  },
);

// 监听父组件传入的roleId变化
watch(
  () => props.roleId,
  (newVal) => {
    checkRolePermissionMenu(newVal);
  },
);

const dataTreeList = ref<SystemMenuApi.SystemMenu[]>([]);
const checkedKeys = ref({ checked: [] as any[], halfChecked: [] as any[]});
// { checked: Key[]; halfChecked: Key[]; }

/** 初始化 */
onMounted(async () => {
  try {
    const data = await fetchMenuTreeListAll({ status: 1 });
    dataTreeList.value = data;
    checkRolePermissionMenu(props.roleId);
  } catch (error) {
    console.error('获取树形结构数据失败', error);
  } finally {
    loadingTree.value = false;
  }
});

async function checkRolePermissionMenu(roleId: string) {
  if (roleId) {
    const checkMenuIds = await fetchAssignmentPermissionIdsByRoleId(roleId);
    if (checkMenuIds && checkMenuIds.length > 0) {
      // treeRef.value.setCheckedKeys(checkMenuIds);
      checkedKeys.value.checked = checkMenuIds;
    }
  }
}

// 获取所有节点ID（包括子节点）
const getAllNodeIds = (data: SystemMenuApi.SystemMenu[]) => {
  const ids: string[] = [];
  const traverse = (nodes: SystemMenuApi.SystemMenu[]) => {
    nodes.forEach((node: SystemMenuApi.SystemMenu) => {
      ids.push(node.id);
      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    });
  };
  traverse(data);
  return ids;
};

// 全选
function toggleSelectAll() {
  if (!props.roleId) return;
  const allIds = getAllNodeIds(dataTreeList.value);
  checkedKeys.value.checked = allIds;
  // treeRef.value.setCheckedKeys(allIds);
}
// 全不选
function toggleNotSelectAll() {
  // treeRef.value.setCheckedKeys([]);
  checkedKeys.value.checked = [];
}

const expandedKeys = ref<string[]>([]);
// 全部折叠
function collapseAll() {
  // Object.values(treeRef.value.store.nodesMap).forEach((v: any) => v.collapse());
  expandedKeys.value = [];
}
// 全部展开
function expandAll() {
  const allIds = getAllNodeIds(dataTreeList.value);
  expandedKeys.value = allIds;
  // Object.values(treeRef.value.store.nodesMap).forEach((v: any) => v.expand());
}

// 处理级联选中-全选/取消全选
const handleCascadeCheck = (
  nodeData: SystemMenuApi.SystemMenu,
  checkboxChangeEvent: CheckboxChangeEvent,
) => {
  const checked = checkboxChangeEvent.target.checked;
  const keysToUpdate = [nodeData.id, ...getAllChildKeys(nodeData, checked)];
  // const currentCheckedKeys: string[] = checkedKeys.value;//treeRef.value.getCheckedKeys();
  let newCheckedKeys: string[] = [];
  if (checked) {
    // 添加当前节点和所有子节点
    newCheckedKeys = [
      ...new Set([...checkedKeys.value.checked, ...keysToUpdate]),
    ];
    setNodesChecked(
      dataTreeList.value,
      [nodeData.id],
      true,
      'checkedChildrenAll',
    );
  } else {
    // 移除当前节点和所有子节点
    newCheckedKeys = checkedKeys.value.checked.filter(
      (key) => !keysToUpdate.includes(key),
    );
    setNodesChecked(
      dataTreeList.value,
      [nodeData.id],
      false,
      'checkedChildrenAll',
    );
  }
  checkedKeys.value.checked = newCheckedKeys;
  // treeRef.value.setCheckedKeys(newCheckedKeys);
};

// 获取所有子节点ID
const getAllChildKeys = (node: SystemMenuApi.SystemMenu, checked?: boolean) => {
  let keys: string[] = [];
  if (checked !== undefined) {
    node.checked = checked;
  }
  if (node.children) {
    node.children.forEach((child) => {
      keys.push(child.id);
      const allChildKeys = getAllChildKeys(child, checked);
      keys = [...keys, ...allChildKeys];
    });
  }
  return keys;
};

/**
 * 控件节点复选框点击
 * @param checkedStateKeys 已经选中的子节点的ID
 * @param info info.halfCheckedKeys为父节点的ID
 */
type CheckedState<T = number | string> =
  | T[]
  | { checked: T[]; halfChecked: T[] };
async function checkChangeNode(
  checkedStateKeys: CheckedState,
  info: CheckInfo,
) {
  const checked = info.checked;
  let node = info.node;

  if (checked) {
    const childrenItems = node?.children || [];
    const checkedKeys: string[] = [];
    if (info.checkedNodes && info.checkedNodes.length > 0) {
      checkedKeys.push(...info.checkedNodes.map((item) => item.id));
    }
    // 只有存在子节点右边才会显示全选复选框，默认没有子节点项，则没有全选复选框
    let isCheck = false;
    if (childrenItems.length > 0) {
      // 存在子节点，检查勾选节点及其所有子节点是否都被选中
      const allKeys = [node.id, ...getAllChildKeys(node)];
      isCheck = allKeys.every((key) => checkedKeys.includes(key));
    } else {
      // 如果点击节点没有子节点了，则往上查找第一个父级节点
      const rootNode = findRootFromNode(
        node,
        dataTreeList.value,
        'parentId',
        1,
      );
      if (rootNode) {
        // 判断上级节点下的所有子节点是否勾选，检查勾选节点及其所有子节点是否都被选中
        const allKeys = [rootNode.id, ...getAllChildKeys(rootNode)];
        isCheck = allKeys.every((key) => checkedKeys.includes(key));
        node = rootNode;
      }
    }

    if (node.children && node.children.length > 0) {
      node.checkedChildrenAll = isCheck;
    }

    // 如果节点及其所有子节点都被选中。那么上级节点全选框也要变成全选
    if (isCheck) {
      // 将当前目录节点右边复选框设置为勾选状态
      setNodesChecked(
        dataTreeList.value,
        [node.id],
        true,
        'checkedChildrenAll',
      );
    }
  } else {
    // 判断节点菜单是否为目录
    if (node.type !== 'catalog') {
      // 如果不是目录，则往上查找第一个父级节点
      const rootNode = findRootFromNode(
        node,
        dataTreeList.value,
        'parentId',
        1,
      );
      if (rootNode) {
        node = rootNode;
      }
    }
    // 将当前目录节点右边复选框设置为未勾选状态
    setNodesChecked(dataTreeList.value, [node.id], false, 'checkedChildrenAll');
  }
}

async function submitForm() {
  try {
    useLoading.show(`正在提交...`);
    const roleAssign = {
      role_id: props.roleId,
      menu_ids: checkedKeys.value.checked,
    } as SystemRoleApi.AssignRoleMenu;

    await assignMenu(roleAssign);
    notification.success(`提交成功`);
  } finally {
    useLoading.hide();
  }
}
</script>
<template>
  <Page
    content-class="my-user-dept-tree"
    header-class="my-user-dept-tree-header"
    :auto-content-height="true"
  >
    <template #title>
      <div class="flex w-1/5 items-center">
        <span class="pl-4 pr-4 text-lg font-semibold"> 权限菜单列表 </span>
        <Input
          class="flex-1"
          v-model="filterText"
          placeholder="搜索"
          :clearable="true"
        />
        <Dropdown>
          <span>
            <EllipsisVertical class="my-user-dept-tree-ellipsisVertical" />
          </span>

          <template #overlay>
            <Menu>
              <MenuItem @click="toggleSelectAll" :disabled="isAdminRole">
                选择全部
              </MenuItem>
              <MenuItem @click="toggleNotSelectAll" :disabled="isAdminRole">
                取消选择
              </MenuItem>
              <MenuItem @click="expandAll">展开全部</MenuItem>
              <MenuItem @click="collapseAll">折叠全部</MenuItem>
            </Menu>
          </template>
        </Dropdown>

        <Popconfirm title="确定要授权吗?" @confirm="submitForm">
          <Button
            v-access:code="['system:permission:assignment']"
            class="ml-6"
            :disabled="!props.roleId"
            type="primary"
            danger
          >
            提交
          </Button>
        </Popconfirm>
      </div>
    </template>
    <!-- v-bind="$attrs"
              v-if="dataTreeList.length > 0"
              ref="treeRef"
              :class="$attrs.class"
              node-key="id"
              v-model:expanded-keys="expandedKeys"
              :tree-data="dataTreeList"
              :field-names="deptTreeFieldNames"
              :show-line="{ showLeafIcon: false }"
              :virtual="false"
              default-expand-all
              @select="deptNodeClick" -->
    <Loading :spinning="loadingTree" text="正在加载...">
      <Tree
        ref="treeRef"
        class="custom-tree max-w-sm"
        node-key="id"
        v-model:checked-keys="checkedKeys"
        v-model:expanded-keys="expandedKeys"
        :tree-data="dataTreeList"
        :field-names="deptTreeFieldNames"
        :show-line="{ showLeafIcon: false }"
        default-expand-all
        :checkable="true"
        :selectable="false"
        :check-strictly="true"
        @check="checkChangeNode"
      >
        <template #title="data">
          <div
            class="flex items-center gap-[5px]"
            :style="{
              color: data.type === 'button' ? 'var(--el-color-primary)' : '',
            }"
            @click.stop="
              () => {
                // 这里只是为了处理标题点击逻辑，避免触发复选框
              }
            "
          >
            <component :is="menuTypeIcon(data.type)" />
            <span>{{ data.name }}</span>
            <Checkbox
              v-if="
                data.type !== 'button' &&
                data.children &&
                data.children.length > 0
              "
              class="ml-2"
              v-model:checked="data.checkedChildrenAll"
              :disabled="isAdminRole"
              @change="(val: any) => handleCascadeCheck(data, val)"
            >
              {{ data?.checkedChildrenAll ? '取消' : '全选' }}
            </Checkbox>
          </div>
        </template>
        <!-- <template #empty>
          <div class="empty-dept-tree ml-28">
            <EmptyIcon />
            <div class="ml-1 mt-2 text-left text-[12px]">暂无数据</div>
          </div>
        </template> -->
      </Tree>
    </Loading>
  </Page>
</template>

<style scoped>
.my-user-dept-tree-ellipsisVertical {
  display: flex;
  align-items: center;
  height: 2rem;
  cursor: pointer;
}

:deep(.my-user-dept-tree) {
  height: calc(var(--vben-content-height) - 77px);
  padding-top: 0.3rem !important;
  padding-bottom: 3rem !important;
  background-color: white;
  border-bottom-right-radius: calc(var(--radius) - 2px) !important;
  border-bottom-left-radius: calc(var(--radius) - 2px) !important;
}

:deep(.my-user-dept-tree-header) {
  padding: 0.375rem 0.5rem;
  border-top-left-radius: calc(var(--radius) - 2px) !important;
  border-top-right-radius: calc(var(--radius) - 2px) !important;
}

/* 去掉鼠标经过el-dropdown 组件上出现蓝色的小框 */
:focus-visible {
  outline: none;
}

:deep(.el-tree-node__content) {
  background-color: transparent !important;
}

/* :deep(.el-tree-node__content:hover) {
  background-color: var(--primary-foreground) !important;
} */

.empty-dept-tree {
  padding: 1rem;
  color: #c0c4cc;
}
</style>
