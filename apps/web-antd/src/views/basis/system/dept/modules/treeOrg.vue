<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, Input } from 'ant-design-vue';

const treeOrgRef = ref();
const treeOrgData = ref<any>({});
// 是否可以展开收起节点
const collapsable = ref(true);
// 架构图是否可缩放
const scalable = ref(true);
const filterText = ref();
const props = { pid: 'parent_id', label: 'name' };
const style = ref({
  background: '#fff',
  color: '#5e6d82',
});

const [BasicModal, modalApi] = useVbenModal({
  async onOpenChange(isOpen) {
    if (isOpen) {
      try {
        modalApi.modalLoading(true);

        const data = modalApi.getData();
        treeOrgData.value = data;
      } finally {
        modalApi.modalLoading(false);
      }
    } else {}
  },
});

function onFilter() {
  if (treeOrgRef.value) {
    treeOrgRef.value.filter(filterText.value);
  }
}
function filterNodeMethod(value: any, data: any) {
  if (!value) {
    return true;
  }
  return data.label.includes(value);
}
</script>

<template>
  <BasicModal
    :footer="false"
    :fullscreen="true"
    :fullscreen-button="false"
    title="部门组织图谱"
  >
    <Input
      v-model:value="filterText"
      style="width: 240px"
      placeholder="请输入搜索内容"
    />
    <Button type="primary" @click="onFilter">搜索</Button>
    <div style="height: calc(100vh - 80px)">
      <vue3-tree-org
        ref="treeOrgRef"
        :data="treeOrgData"
        :collapsable="collapsable"
        :label-style="style"
        :node-draggable="true"
        :center="true"
        :scalable="scalable"
        :default-expand-level="99999999"
        :filter-node-method="filterNodeMethod"
        :props="props"
      >
        <!-- 自定义节点内容 -->
        <template #default="{ node }">
          <div
            class="node overflow-hidden text-ellipsis whitespace-nowrap"
            :title="node.label"
          >
            {{ node.label }}
          </div>
        </template>
        <!-- 自定义展开按钮 -->
        <template #expand="{ node }">
          <div>{{ node.children.length }}</div>
        </template>
      </vue3-tree-org>
    </div>
  </BasicModal>
</template>

<style scoped lang="scss">
:deep(.tree-org-node__content .tree-org-node__inner) {
  box-shadow: none;
}

.node {
  width: 180px;
  padding: 16px 24px;
  text-align: center;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
}
</style>
