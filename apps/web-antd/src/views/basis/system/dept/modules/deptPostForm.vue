<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemDeptApi, SystemPostApi } from '#/api';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { addDeptPost, getDeptPostListByDeptId } from '#/api/basis/system/post';
import { notification } from '#/components/message/useMessage';

import { useAddDeptPostFormSchema, useAddDeptPostSchema } from '../data';

const emit = defineEmits(['success']);
const deptId = ref();
const checkboxList = ref<SystemPostApi.SystemPost[]>([]);
const formData = ref<SystemDeptApi.SystemDept>();

const [Modal, modalApi] = useVbenModal({
  draggable: true,
  destroyOnClose: true,
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<SystemDeptApi.SystemDept>();
      if (data) {
        formData.value = data;
        deptId.value = data.id;
      }
    }
  },
  async onConfirm() {
    if (!checkboxList.value) {
      notification.error('请选择岗位');
      return;
    }

    const postIds: String[] = [];
    checkboxList.value.forEach((item) => {
      postIds.push(item.id);
    });

    try {
      modalApi.lock();
      await addDeptPost({ deptId: deptId.value, postIds });
      notification.success('提交成功');
      emit('success');
      modalApi.close();
    } finally {
      modalApi.unlock();
    }
  },
});
// useAddDeptPostFormSchema
const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useAddDeptPostFormSchema(),
    // 是否在字段值改变时提交表单
    submitOnChange: false,
  },
  gridOptions: {
    columns: useAddDeptPostSchema(),
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          const data = await getDeptPostListByDeptId({
            pageNum: page.currentPage,
            pageSize: page.pageSize,
            deptId: deptId.value,
            checked: false,
            ...formValues,
          });

          const checkedList: Array<any> = [];
          for (let i = 0; i < data.items.length; i++) {
            const element = data.items[i];
            if (element.checked) {
              checkedList.push(element);
            }
          }
          if (checkedList.length > 0) {
            gridApi.grid.setCheckboxRow(checkedList, true);
          }

          return data;
        },
      },
    },
    stripe: true, // 斑马线条纹
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    checkboxConfig: {
      // labelField: 'name',
      // highlight: true
      range: true,
    },
    toolbarConfig: {
      custom: false,
      export: false,
      refresh: { code: 'query' },
      search: false,
      zoom: true,
    },
  } as VxeTableGridOptions<SystemPostApi.SystemPost>,
  gridEvents: {
    checkboxChange: selectChangeEvent,
    checkboxAll: selectChangeEvent,
    checkboxRangeChange: selectChangeEvent,
  },
});

function selectChangeEvent(params: any) {
  checkboxList.value = params.records;
}

const getTitle = computed(() => {
  return `部门【${formData.value?.name}】添加岗位`;
});
</script>
<template>
  <Modal :title="getTitle" class="w-[900px]">
    <Grid
      table-title="岗位列表"
      table-title-help="只展示未被该部门关联的岗位"
    />
  </Modal>
</template>

<style scoped>
.row--hover {
  background-color: var(--vben-color-bg-1);
}
</style>
