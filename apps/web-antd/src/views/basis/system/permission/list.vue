<script lang="ts" setup>
import type { SystemRoleApi } from '#/api';

import { computed, onMounted, reactive, ref } from 'vue';

import { ColPage } from '@vben/common-ui';
import { EmptyIcon } from '@vben/icons';

import { Input, Radio, RadioGroup } from 'ant-design-vue';

import { fetchRoleListAll } from '#/api/basis/system/role';

import MenuTree from './modules/menuTree.vue';

const props = reactive({
  leftCollapsible: false,
  leftWidth: 10,
  resizable: false,
  rightWidth: 90,
  splitHandle: false,
  splitLine: false,
});

const loadingRole = ref(true);
const roleId = ref();
const isAdminRole = ref(false);
const filterRole = ref('');

const roleList = ref<SystemRoleApi.SystemRole[]>([]);

onMounted(async () => {
  try {
    roleList.value = await fetchRoleListAll({ status: 'ENABLE' });
    if (roleList.value && roleList.value.length > 0) {
      const roleItem = roleList.value[0];
      roleId.value = roleItem?.id;
      if (roleItem) {
        changeRole(roleItem);
      }
    }
  } finally {
    loadingRole.value = false;
  }
});

const filteredRoleList = computed(() => {
  return filterRole.value
    ? roleList.value.filter((item) => item.name.includes(filterRole.value))
    : roleList.value;
});

const changeRole = (roleItem: SystemRoleApi.SystemRole) => {
  isAdminRole.value = roleItem?.roleCode === 'admin';
};
</script>
<template>
  <ColPage v-bind="props" auto-content-height>
    <template #left>
      <div
        class="mr-2 h-full rounded-[var(--radius)] border border-border bg-card p-2 pb-12"
      >
        <div class="flex">
          <div class="w-1/3 pt-1 text-left text-sm">角色列表</div>
          <div class="w-3/4">
            <Input
              v-model:value="filterRole"
              allow-clear
              placeholder="输入搜索角色"
              class="mb-2"
            />
          </div>
        </div>
        <div
          class="h-full overflow-scroll rounded-[var(--radius)] border border-border bg-card p-2"
          v-if="filteredRoleList && filteredRoleList.length > 0"
        >
          <RadioGroup v-spinning="loadingRole" v-model:value="roleId">
            <Radio
              class="custom-border mt-2 w-full"
              :class="roleId === item.id ? 'custom-border-checked' : ''"
              v-for="(item, index) in filteredRoleList"
              :value="item.id"
              :key="index"
              size="large"
              border
              @change="changeRole(item)"
            >
              {{ item.name }}
            </Radio>
          </RadioGroup>
        </div>
        <div class="mt-6 justify-items-center" v-else>
          <EmptyIcon />
          <div class="mt-2 text-left text-[12px]">暂无数据</div>
        </div>
      </div>
    </template>
    <MenuTree :role-id="roleId" :is-admin-role="isAdminRole" />
  </ColPage>
</template>
<style lang="scss" scoped>
.custom-border {
  padding: 8px 12px;
  font-size: 14px;
  color: rgb(50 54 57);
  border: 1px solid rgb(228 228 231);
  border-radius: 0.5rem;
}

.custom-border-checked {
  border: 1px solid rgb(0 107 230) !important;
}
</style>
