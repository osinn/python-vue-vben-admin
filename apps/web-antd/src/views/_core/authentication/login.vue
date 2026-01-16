<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';

import { computed } from 'vue';

import { AuthenticationLogin, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { getPublicKeyApi } from '#/api';
import { useAuthStore } from '#/store';
import { RSAdecrypt, RSAencrypt } from '#/utils/decryptUtil';
import { useSystemStore } from '#/utils/storeHelper';
import { generateUUID } from '#/utils/toolUtils';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();

const REMEMBER_ME_KEY = `REMEMBER_ME_USERNAME_${location.hostname}`;

interface RememberMeLoginForm {
  /** 登录表单记住账号 */
  account: string;
  /** 登录表单记住密码 */
  password: string;
}
const formSchema = computed((): VbenFormSchema[] => {
  let account = '';
  let password = '';

  const localRememberMe = localStorage.getItem(REMEMBER_ME_KEY);
  const rememberMe = !!localRememberMe;
  if (rememberMe) {
    try {
      const decrypt: null | string = useSystemStore.getStore(REMEMBER_ME_KEY);
      if (decrypt) {
        const data = RSAdecrypt(
          decrypt,
          import.meta.env.VITE_USE_RSA_PRIVATE_KEY,
        ) as string;
        if (data) {
          const rememberMeLoginForm: RememberMeLoginForm = JSON.parse(data);
          account = rememberMeLoginForm.account;
          password = rememberMeLoginForm.password;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: '请输入账号',
      },
      fieldName: 'account',
      defaultValue: account,
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: '请输入账号' }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      defaultValue: password,
      label: $t('authentication.password'),
      rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
    },
  ];
});

const authLogin = async (values: Record<string, any>) => {
  values.account = values.account.trim();
  values.password = values.password.trim();
  const localRememberMe = localStorage.getItem(REMEMBER_ME_KEY);
  const rememberMe = !!localRememberMe;

  if (rememberMe) {
    try {
      const rememberMeLoginForm: RememberMeLoginForm = {
        password: values.password,
        account: values.account,
      };
      const str = RSAencrypt(
        JSON.stringify(rememberMeLoginForm),
        import.meta.env.VITE_USE_RSA_PUBLIC_KEY,
      ) as string;
      useSystemStore.setStore(REMEMBER_ME_KEY, str);
    } catch (error) {
      console.error(error);
    }
  } else {
    useSystemStore.removeStore(REMEMBER_ME_KEY);
  }

  try {
    authStore.loginLoading = true;
    const ticket = generateUUID(true);
    const publicKey = await getPublicKeyApi({ ticket });
    values.password = RSAencrypt(values.password, publicKey);
    values.ticket = ticket;
  } catch (error) {
    console.log('获取加密密钥失败', error);
    authStore.loginLoading = false;
  }

  await authStore.authLogin(values);
};
</script>

<template>
  <AuthenticationLogin
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    :show-code-login="false"
    :show-forget-password="false"
    :show-qrcode-login="false"
    :show-register="false"
    :show-third-party-login="false"
    :show-remember-me="true"
    @submit="authLogin"
  />
</template>
