<script lang="ts" setup>
import type { SystemDeptApi } from '#/api/basis/system/dept';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { createDept, updateDept } from '#/api/basis/system/dept';
import { fetchDeptAllTree } from '#/api/basis/system/dept';
import { useSchema } from '../data';

const emit = defineEmits(['success']);
const formData = ref<SystemDeptApi.SystemDept>();
const getTitle = computed(() => {
  return formData.value?.id ? '编辑部门' : '新增部门';
});

const [Form, formApi] = useVbenForm({
  layout: 'vertical',
  schema: useSchema(),
  showDefaultActions: false,
});

function resetForm() {
  formApi.resetForm();
  formApi.setValues(formData.value || {});
}


async function loadDeptAllTreeOptions(dept_id: string) {
  const deptAllTree = await fetchDeptAllTree({disabled_of_dept_id: dept_id})

  formApi.updateSchema([
    {
      componentProps: {
        class: 'w-full', // 宽度100%
        // labelField: 'name',
        // valueField: 'id',
        // childrenField: 'children',
        treeData: deptAllTree,
        placeholder: '请选择上级部门',
        fieldNames: {
          key: 'id',
          value: 'id',
          label: 'name',
          children: 'children',
        },
        nodeKey: 'id',
        filterable: true,
        checkStrictly: true,
      },


      fieldName: 'parent_id',
    },
  ]);
}

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (valid) {
      modalApi.lock();
      const data = await formApi.getValues();
      try {
        await (formData.value?.id
          ? updateDept(formData.value.id, data)
          : createDept(data));
        modalApi.close();
        emit('success');
      } finally {
        modalApi.lock(false);
      }
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<SystemDeptApi.SystemDept>();
      if (data) {
        if (data.parent_id === 0) {
          data.parent_id = undefined;
        }
        formData.value = data;
        formApi.setValues(formData.value);
      }
      loadDeptAllTreeOptions(data?.id);
    }
  },
});
</script>

<template>
  <Modal :title="getTitle">
    <Form class="mx-4" />
    <template #prepend-footer>
      <div class="flex-auto">
        <Button type="primary" danger @click="resetForm"> 重置 </Button>
      </div>
    </template>
  </Modal>
</template>
