<script lang="ts" setup>
import type { SystemPostApi, SystemRoleApi } from '#/api';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { getPopupContainer } from '@vben/utils';

import { useVbenForm } from '#/adapter/form';
import { fetchDeptAllTree } from '#/api/basis/system/dept';
import { getDeptPostListByDeptId } from '#/api/basis/system/post';
import { fetchRoleListAll } from '#/api/basis/system/role';
import { createUser, updateUser } from '#/api/basis/system/user';

import { useFormSchema } from '../data';

const emit = defineEmits<{
  success: [];
}>();

const formData = ref<SystemRoleApi.SystemRole>();

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
});

const id = ref();

async function loadPostOptions(dept_id: string) {
  let options = [];
  let placeholder;
  if (dept_id !== null && dept_id !== undefined) {
    const param: SystemPostApi.DeptPostQuery = {
      dept_id,
      status: 1,
      checked: true,
    };
    const data: any = await getDeptPostListByDeptId(param);
    options = data?.items.map((item: any) => ({
      label: item.name,
      value: item.id,
    }));

    placeholder = options.length > 0 ? '请选择岗位' : '该部门下暂无岗位';
  } else {
    placeholder = '请选择部门';
  }

  formApi.updateSchema([
    {
      componentProps: {
        class: 'w-full',
        getPopupContainer,
        options,
        placeholder,
      },
      fieldName: 'post_ids',
    },
  ]);
}
/**
 * 加载下拉选择部门
 */
async function loadDeptSelect() {
  const deptAllTree = await fetchDeptAllTree();
  formApi.updateSchema([
    {
      componentProps: (formModel) => ({
        class: 'w-full',
        onChange(deptId: string) {
          /** 根据部门ID加载岗位 */
          loadPostOptions(deptId);
          /** 变更部门后需要重新加载对应部门下的岗位 */
          formModel.post_ids = [];
        },
        treeData: deptAllTree,
        placeholder: '请选择所属部门',
        fieldNames: {
          key: 'id',
          value: 'id',
          label: 'name',
          children: 'children',
        },
        nodeKey: 'id',
        filterable: true,
        clearable: true,
        checkStrictly: true,
      }),
      fieldName: 'dept_id',
    },
  ]);
}

/**
 * 加载下拉选择角色
 */
async function loadRoleSelect() {
  const role_param = { status: 1 } as SystemRoleApi.SystemRole;
  const roles = await fetchRoleListAll(role_param);
  formApi.updateSchema([
    {
      componentProps: {
        class: 'w-full',
        getPopupContainer,
        options: roles.map((item: any) => ({
          label: item.name,
          value: item.id,
        })),
      },
      fieldName: 'role_ids',
    },
  ]);
}

const [Drawer, drawerApi] = useVbenDrawer({
  onClosed: () => {
    formApi.resetForm();
  },
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    drawerApi.lock();
    (id.value ? updateUser(id.value, values) : createUser(values))
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
      if (data) {
        formData.value = data;
        id.value = data.id;
        formApi.setValues(data);
      } else {
        id.value = undefined;
      }
      loadDeptSelect();
      loadRoleSelect();

      if (data?.dept_id) {
        /** 根据部门ID加载岗位 */
        loadPostOptions(data.dept_id);
      }
    }
  },
});

const getDrawerTitle = computed(() => {
  return formData.value?.id ? '编辑用户' : '新增用户';
});
</script>
<template>
  <Drawer :title="getDrawerTitle">
    <Form />
  </Drawer>
</template>
<style lang="css" scoped>
:deep(.ant-tree-title) {
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
}
</style>
