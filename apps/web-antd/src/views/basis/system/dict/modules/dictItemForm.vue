<script lang="ts" setup>
import type { SystemDictItemApi } from '#/api';

import { computed, ref } from 'vue';

import { useVbenForm, useVbenModal } from '@vben/common-ui';

import { createDictItem, updateDictItem } from '#/api/basis/system/dictItem';
import { notification } from '#/components/message/useMessage';

import { useFormSchema } from '../dictItemData';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<SystemDictItemApi.SystemDictItem>();

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  draggable: true,
  onOpenChange(isOpen) {
    if (isOpen) {
      formApi.resetForm();
      const data = modalApi.getData<SystemDictItemApi.SystemDictItem>();
      if (data) {
        formData.value = data;
        formApi.setValues(formData.value);
      }
    }
  },
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    modalApi.lock();
    (formData.value?.id
      ? updateDictItem(formData.value.id, values)
      : createDictItem(values)
    )
      .then(() => {
        notification.success(
          `${formData.value?.id ? `编辑【${values.dictItemName}】成功` : `新增【${values.dictItemName}】成功`}`,
        );
        modalApi.close();
        emit('success');
      })
      .catch(() => {
        modalApi.unlock();
      });
  },
});

const getModalTitle = computed(() => {
  return formData.value?.id ? '编辑字典项' : '新增字典项';
});
</script>
<template>
  <Modal :title="getModalTitle">
    <Form />
  </Modal>
</template>
