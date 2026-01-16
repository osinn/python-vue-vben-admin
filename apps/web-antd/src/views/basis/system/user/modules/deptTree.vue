<script lang="ts" setup>
import type { SystemDeptApi } from '#/api/basis/system/dept';

import { computed, onMounted, ref, watch } from 'vue';

import { Loading, Page } from '@vben/common-ui';
import { EllipsisVertical } from '@vben/icons';

import { Dropdown, Empty, Input, Menu, MenuItem, Tree } from 'ant-design-vue';

import { fetchSimpleDeptAllTree } from '#/api/basis/system/dept';
import { optimizedFindNodesWithParents, treeToList } from '#/utils/treeUtils';

const emit = defineEmits<{
  select: [event: null | SystemDeptApi.SystemDept];
}>();
const filterText = ref('');
const loadingDeptTree = ref(false);
const treeRef = ref();
const selectedNodeId = ref<string>();

watch(filterText, async (val) => {
  const data =
    val && val.length > 0
      ? optimizedFindNodesWithParents(filterList.value, val)
      : filterList.value;
  dataTreeList.value = data;
});

const deptTreeFieldNames = ref({ title: 'name', key: 'id' });

// 所有节点的ID
const allTreeKeys = computed(() => {
  const idField = deptTreeFieldNames.value.key;
  return treeToList(dataTreeList.value).map((item: any) => item[idField]);
});

// 渲染树形结构
const dataTreeList = ref<SystemDeptApi.SystemDept[]>([]);
// 用于筛选赋值 dataTreeList 进行渲染
const filterList = ref<SystemDeptApi.SystemDept[]>([]);
// 展开/折叠
const expandedKeys = ref([]);

/** 初始化 */
onMounted(async () => {
  try {
    loadingDeptTree.value = true;
    filterText.value = '';
    const data = await fetchSimpleDeptAllTree();
    dataTreeList.value = data;
    filterList.value = data;
    // if (data && data.length > 0) {
    //   const checkItem = data[0] as SystemDeptApi.SystemDept;
    //   treeRef.value.setCurrentKey(checkItem?.id);
    //   deptNodeClick(checkItem);
    // }
  } catch (error) {
    console.error('获取部门数据失败', error);
  } finally {
    loadingDeptTree.value = false;
  }
});

/**
 * 全部折叠
 */
function collapseAll() {
  // allTreeKeys
  // Object.values(treeRef.value.store.nodesMap).forEach((v: any) => v.collapse());
  expandedKeys.value = [];
}

/**
 * 全部展开
 */
function expandAll() {
  // Object.values(treeRef.value.store.nodesMap).forEach((v: any) => v.expand());
  expandedKeys.value = allTreeKeys.value;
}
// function(selectedKeys, e:{selected: bool, selectedNodes, node, event})
function deptNodeClick(selectedKeys: any, e: any) {
  console.log('deptNodeClick', e.selectedNodes);
  const node: SystemDeptApi.SystemDept =
    e.selectedNodes.length > 0 ? e.selectedNodes[0] : null;
  const isCurrent = selectedNodeId.value === node?.id;
  selectedNodeId.value = isCurrent ? '' : node?.id;
  // treeRef.value?.setCurrentKey(isCurrent ? null : node.id);
  emit('select', isCurrent ? null : node);
}
</script>
<template>
  <Page
    content-class="my-user-dept-tree"
    header-class="my-user-dept-tree-header"
  >
    <template #title>
      <div class="flex items-center">
        <span class="pl-4 pr-4 text-lg font-semibold"> 部门列表 </span>
        <Input
          class="flex-1"
          v-model:value="filterText"
          placeholder="搜索"
          :allow-clear="true"
        />
      </div>
    </template>
    <template #extra>
      <Dropdown>
        <span>
          <EllipsisVertical class="my-user-dept-tree-ellipsisVertical" />
        </span>

        <template #overlay>
          <Menu>
            <MenuItem @click="expandAll">展开全部</MenuItem>
            <MenuItem @click="collapseAll">折叠全部</MenuItem>
          </Menu>
        </template>
      </Dropdown>
    </template>
    <!-- v-bind="$attrs"
            v-if="deptTreeArray.length > 0"
            v-model:selected-keys="selectDeptId"
            :class="$attrs.class"
            :field-names="{ title: 'label', key: 'id' }"
            :show-line="{ showLeafIcon: false }"
            :tree-data="deptTreeArray"
            :virtual="false"
            default-expand-all
            @select="$emit('select')" -->
    <Loading :spinning="loadingDeptTree" text="正在加载...">
      <Tree
        v-bind="$attrs"
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
        @select="deptNodeClick"
      >
        <template #title="{ name }">
          <span v-if="name.includes(filterText)">
            {{ name.substring(0, name.indexOf(filterText)) }}
            <span style="color: #f50">{{ filterText }}</span>
            {{ name.substring(name.indexOf(filterText) + filterText.length) }}
          </span>
          <span>{{ name }}</span>
        </template>
        <!-- <template #empty>
                <div class="empty-dept-tree">
                  <EmptyIcon class="mx-auto" />
                  <div class="mt-2 text-[12px]">
                    {{ dataTreeList.length === 0 && !loadingDeptTree ? '暂无部门数据，请先添加部门' : '暂无数据' }}
                  </div>
                </div>
              </template> -->
      </Tree>
      <div v-else class="mt-5">
        <Empty :image="Empty.PRESENTED_IMAGE_SIMPLE" description="无部门数据" />
      </div>
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
  background-color: white;
  border-bottom-right-radius: calc(var(--radius) - 2px) !important;
  border-bottom-left-radius: calc(var(--radius) - 2px) !important;
}

:deep(.my-user-dept-tree-header) {
  padding: 0.375rem 0.5rem;
  border-top-left-radius: calc(var(--radius) - 2px) !important;
  border-top-right-radius: calc(var(--radius) - 2px) !important;

  /* margin-bottom: .25rem; */
}

/* 去掉鼠标经过el-dropdown 组件上出现蓝色的小框 */
:focus-visible {
  outline: none;
}

:deep(.el-tree-node:focus > .el-tree-node__content) {
  background-color: transparent !important;
}

:deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: #e3f4fc !important;
}

:deep(.el-tree-node.is-current > .el-tree-node__content:hover) {
  background-color: #e3f4fc !important;
}

:deep(
  .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content
) {
  background-color: #e3f4fc !important;
}

.empty-dept-tree {
  padding: 1rem;
  color: #c0c4cc;
}
</style>
