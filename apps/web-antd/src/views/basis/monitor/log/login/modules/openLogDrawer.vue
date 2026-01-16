<script setup lang="ts">
import type { SysHttpLogApi } from '#/api/basis/monitor/sysHttpLog';

import { nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { Descriptions, DescriptionsItem } from 'ant-design-vue';

import { DictTag } from '#/components/dict';
import { OperateStatusEnum } from '#/enums/logOperateEnum';

// 打开侧拉传递过来的实体类
const dataRef = ref<SysHttpLogApi.SysHttpLog>();
const [Drawer, drawerApi] = useVbenDrawer({
  showConfirmButton: false,
  showCancelButton: false,
  onOpenChange(isOpen) {
    if (!isOpen) {
      return;
    }
    nextTick(() => {
      const data = drawerApi.getData<SysHttpLogApi.SysHttpLog>();
      dataRef.value = { ...data };
      if (dataRef.value?.requestParams) {
        try {
          dataRef.value.requestParams = JSON.parse(dataRef.value.requestParams);
        } catch {}
      }

      if (dataRef.value?.resultData) {
        try {
          const resultData = JSON.parse(dataRef.value.resultData);
          dataRef.value.resultData = Array.isArray(resultData)
            ? resultData
            : [resultData];
        } catch {
          dataRef.value.resultData = [];
        }
      }
    });
  },
});
</script>

<template>
  <Drawer title="详情" class="w-[600px]">
    <Descriptions bordered :column="1">
      <DescriptionsItem label="登录账号" label-align="right">
        {{ dataRef?.account }}
      </DescriptionsItem>
      <DescriptionsItem label="登录时间" label-align="right">
        {{ dataRef?.createdTime }}
      </DescriptionsItem>
      <DescriptionsItem label="登录状态" label-align="right">
        <DictTag :dicts="OperateStatusEnum" :value="dataRef?.status" />
      </DescriptionsItem>
      <DescriptionsItem label="IP地址" label-align="right">
        {{ dataRef?.ipAddress }}
      </DescriptionsItem>
      <DescriptionsItem label="IP地址归属地" label-align="right">
        {{ dataRef?.ipAddressAttr }}
      </DescriptionsItem>
      <DescriptionsItem label="浏览器" label-align="right">
        {{ dataRef?.browser }}
      </DescriptionsItem>
      <DescriptionsItem label="操作系统" label-align="right">
        {{ dataRef?.os }}
      </DescriptionsItem>
    </Descriptions>
  </Drawer>
</template>
<style scoped lang="scss">
:deep(.is-bordered-label) {
  width: 120px !important;
  font-weight: normal !important;
}
</style>
