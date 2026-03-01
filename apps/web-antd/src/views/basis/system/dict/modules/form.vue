<script lang="ts" setup>
import type { SystemDictApi } from '#/api';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { createDict, updateDict } from '#/api/basis/system/dict';
import { notification } from '#/components/message/useMessage';

import { useFormSchema } from '../data';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<SystemDictApi.SystemDict>();

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
});

const id = ref();
const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    drawerApi.lock();
    (id.value ? updateDict(id.value, values) : createDict(values))
      .then(() => {
        console.log('新增字典', JSON.stringify(values));
        notification.success(
          `${formData.value?.id ? `编辑【${values?.dict_name}】成功` : `新增【${values?.dict_name}】成功`}`,
        );
        drawerApi.close();
        emit('success');
      })
      .catch(() => {
        drawerApi.unlock();
      });
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      formApi.resetForm();
      const data = drawerApi.getData<SystemDictApi.SystemDict>();
      if (data) {
        formData.value = data;
        id.value = data.id;
        formApi.setValues(data);
      } else {
        id.value = undefined;
      }
    }
  },
});

const getDrawerTitle = computed(() => {
  return formData.value?.id ? '编辑字典' : '新增字典';
});
</script>
<template>
  <Drawer :title="getDrawerTitle">
    <Form />
  </Drawer>
</template>
<style lang="css" scoped></style>
