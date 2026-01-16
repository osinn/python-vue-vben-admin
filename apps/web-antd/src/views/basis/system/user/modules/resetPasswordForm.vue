<script lang="ts" setup>
import { useVbenModal, z } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { resetPwd } from '#/api/basis/system/user';
import { useLoading } from '#/components/loading';
import { notification } from '#/components/message/useMessage';

defineOptions({
  name: 'ResetPwdFormModel',
});

const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema: [
    {
      component: 'Input',
      fieldName: 'id',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      component: 'Input',
      fieldName: 'nickname',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        passwordStrength: true,
        placeholder: '请输入密码',
      },
      fieldName: 'password',
      label: '密码',
      hideLabel: true,
      renderComponentContent() {
        return {
          strengthText: () => '使用 8 个或更多字符，混合字母、数字和符号',
        };
      },
      rules: z.string().min(1, { message: '请输入密码' }),
    },
  ],
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    await formApi.validateAndSubmitForm();
    // modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const values = modalApi.getData<Record<string, any>>();
      if (values) {
        formApi.setValues(values);
      }
    }
  },
  title: '内嵌表单示例',
});

async function onSubmit(values: Record<string, any>) {
  try {
    useLoading.show('正在提交中...');
    await resetPwd({ id: values.id, password: values.password });
    modalApi.close();
    notification.success(`用户【${values.nickname}】密码重置成功`);
  } finally {
    useLoading.hide();
  }
}
</script>
<template>
  <Modal>
    <Form />
  </Modal>
</template>
