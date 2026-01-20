<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type { VbenFormSchema } from '#/adapter/form';

import { computed, h, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { getPopupContainer } from '@vben/utils';

import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';

import { useVbenForm, z } from '#/adapter/form';
import {
  createMenu,
  fetchMenuTreeListAll,
  isMenuNameExists,
  isMenuPathExists,
  SystemMenuApi,
  updateMenu,
} from '#/api/basis/system/menu';
import { $t } from '#/locales';
import { componentKeys } from '#/router/routes';

import { getMenuTypeOptions } from '../data';

const emit = defineEmits<{
  success: [];
}>();
const formData = ref<SystemMenuApi.SystemMenu>();
const titleSuffix = ref<string>();
const schema: VbenFormSchema[] = [
  {
    component: 'RadioGroup',
    fieldName: 'type',
    label: '类型',
    defaultValue: 'menu',
    componentProps: {
      isButton: true,
      options: getMenuTypeOptions(),
    },
    formItemClass: 'col-span-2 md:col-span-2',
  },
  {
    component: 'Input',
    fieldName: 'name',
    label: '菜单名称', // $t('system.menu.menuName'),
    rules: z
      .string()
      .min(2, '菜单名称至少2个字符') // $t('ui.formRules.minLength', [$t('system.menu.menuName'), 2])
      .max(30, '菜单名称最多30个字符') // $t('ui.formRules.maxLength', [$t('system.menu.menuName'), 30])
      .refine(
        async (value: string) => {
          return !(await isMenuNameExists(value, formData.value?.id));
        },
        (value) => ({
          message: `菜单名称 ${value} 已存在`,
          // message: $t('ui.formRules.alreadyExists', [
          //   $t('system.menu.menuName'),
          //   value,
          // ]),
        }),
      ),
  },
  {
    component: 'ApiTreeSelect',
    componentProps: {
      api: fetchMenuTreeListAll,
      class: 'w-full',
      filterTreeNode(input: string, node: Recordable<any>) {
        if (!input || input.length === 0) {
          return true;
        }
        const title: string = node.meta?.title ?? '';
        if (!title) return false;
        return title.includes(input) || $t(title).includes(input);
      },
      checkStrictly: true,
      getPopupContainer,
      labelField: 'meta.title',
      showSearch: true,
      treeDefaultExpandAll: true,
      valueField: 'id',
      childrenField: 'children',
    },
    fieldName: 'parent_id',
    label: '上级菜单', // $t('system.menu.parent'),
    renderComponentContent() {
      return {
        title({ label, meta }: { label: string; meta: Recordable<any> }) {
          const coms = [];
          if (!label) return '';
          if (meta?.icon) {
            coms.push(h(IconifyIcon, { class: 'size-4', icon: meta.icon }));
          }
          coms.push(h('span', { class: '' }, $t(label || '')));
          return h('div', { class: 'flex items-center gap-1' }, coms);
        },
      };
    },
  },
  {
    component: 'Input',
    // componentProps() {
    //   // 不需要处理多语言时就无需这么做
    //   return {
    //     addonAfter: titleSuffix.value,
    //     onChange(value: string | number) {
    //       titleSuffix.value = value && $te(value) ? $t(value) : undefined;
    //     },
    //   };
    // },
    fieldName: 'meta.title',
    label: '菜单标题', // $t('system.menu.menuTitle'),
    rules: 'required',
  },
  {
    component: 'Input',
    dependencies: {
      show: (values) => {
        return ['catalog', 'embedded', 'menu'].includes(values.type);
      },
      triggerFields: ['type'],
    },
    fieldName: 'path',
    label: '路由地址', // $t('system.menu.path'),
    rules: z
      .string()
      .min(2, '路由地址至少2个字符')
      .max(100, '路由地址最多100个字符')
      .refine((value: string) => {
        return value.startsWith('/');
      }, '路由地址必须以 / 开头')
      .refine(
        async (value: string) => {
          return !(await isMenuPathExists(value, formData.value?.id));
        },
        (value) => ({
          message: `路由地址 ${value} 已存在`,
          // message: $t('ui.formRules.alreadyExists', [
          //   $t('system.menu.path'),
          //   value,
          // ]),
        }),
      ),
  },
  {
    component: 'Input',
    dependencies: {
      show: (values) => {
        return ['embedded', 'menu'].includes(values.type);
      },
      triggerFields: ['type'],
    },
    fieldName: 'active_path',
    help: '跳转到当前路由时，需要激活的菜单路径。\n当不在导航菜单中显示时，需要指定激活路径',
    label: '激活路径',
    rules: z
      .string()
      .min(2, '激活路径至少2个字符')
      .max(100, '激活路径最多100个字符')
      // .max(100, $t('ui.formRules.maxLength', [$t('system.menu.path'), 100]))
      .refine((value: string) => {
        return value.startsWith('/');
      }, '激活路径必须以 / 开头')
      .refine(async (value: string) => {
        return await isMenuPathExists(value, formData.value?.id);
      }, '该路径未能找到有效的菜单')
      .optional(),
  },
  {
    component: 'IconPicker',
    componentProps: {
      prefix: 'carbon',
    },
    dependencies: {
      show: (values) => {
        return ['catalog', 'embedded', 'link', 'menu'].includes(values.type);
      },
      triggerFields: ['type'],
    },
    fieldName: 'meta.icon',
    label: '图标',
    defaultValue: 'carbon:security',
  },
  {
    component: 'IconPicker',
    componentProps: {
      prefix: 'carbon',
    },
    dependencies: {
      show: (values) => {
        return ['catalog', 'embedded', 'menu'].includes(values.type);
      },
      triggerFields: ['type'],
    },
    fieldName: 'meta.active_icon',
    label: '激活图标',
    defaultValue: 'carbon:security',
  },
  {
    component: 'Input',
    componentProps: {
      clearable: true,
      class: 'w-full',
      filterOption(input: string, option: { value: string }) {
        return option.value.toLowerCase().includes(input.toLowerCase());
      },
      options: componentKeys.map((v) => ({ value: v })),
    },
    dependencies: {
      rules: (values) => {
        return values.type === 'menu' ? 'required' : null;
      },
      show: (values) => {
        return values.type === 'menu';
      },
      triggerFields: ['type'],
    },
    fieldName: 'component',
    label: '页面组件', // $t('system.menu.component'),
  },
  {
    component: 'Input',
    dependencies: {
      show: (values) => {
        return ['embedded', 'link'].includes(values.type);
      },
      triggerFields: ['type'],
    },
    fieldName: 'link_src',
    label: '链接地址', // $t('system.menu.linkSrc'),
    rules: z.string().url('请输入有效的链接'),
  },
  {
    component: 'Input',
    dependencies: {
      rules: (values) => {
        return values.type === 'button' ? 'required' : null;
      },
      show: (values) => {
        return ['button', 'catalog', 'embedded', 'menu'].includes(values.type);
      },
      triggerFields: ['type'],
    },
    fieldName: 'auth_code',
    label: '权限标识',
  },
  {
    component: 'RadioGroup',
    fieldName: 'status',
    label: '状态',
    defaultValue: 1,
    componentProps: {
      isButton: true,
      options: [
        { label: '已启用', value: 1 },
        { label: '已禁用', value: 2 },
      ],
    },
  },
  {
    component: 'Select',
    componentProps: {
      clearable: true,
      class: 'w-full',
      options: [
        { label: '点', value: 'dot' },
        { label: '文字', value: 'normal' },
      ],
    },
    dependencies: {
      show: (values) => {
        return values.type !== 'button';
      },
      triggerFields: ['type'],
    },
    fieldName: 'meta.badge_type',
    label: '徽标类型', // $t('system.menu.badgeType'),
  },
  {
    component: 'Input',
    componentProps: (values) => {
      return {
        clearable: true,
        class: 'w-full',
        disabled: values.meta?.badgeType !== 'normal',
      };
    },
    dependencies: {
      show: (values) => {
        return values.type !== 'button';
      },
      triggerFields: ['type'],
    },
    fieldName: 'meta.badge',
    label: '徽章内容', // $t('system.menu.badge'),
  },
  {
    component: 'Select',
    componentProps: {
      clearable: true,
      class: 'w-full',
      options: SystemMenuApi.BadgeVariants.map((v) => ({
        label: v,
        value: v,
      })),
    },
    dependencies: {
      show: (values) => {
        return values.type !== 'button';
      },
      triggerFields: ['type'],
    },
    fieldName: 'meta.badge_variants',
    label: '徽标样式', // $t('system.menu.badgeVariants'),
  },
  {
    component: 'Divider',
    dependencies: {
      show: (values) => {
        return !['button', 'link'].includes(values.type);
      },
      triggerFields: ['type'],
    },
    fieldName: 'divider1',
    formItemClass: 'col-span-2 md:col-span-2 pb-0',
    hideLabel: true,
    renderComponentContent() {
      return {
        default: () => '其它设置',
      };
    },
  },
  {
    component: 'Checkbox',
    dependencies: {
      show: (values) => {
        return ['menu'].includes(values.type);
      },
      triggerFields: ['type'],
    },
    fieldName: 'meta.keep_alive',
    renderComponentContent() {
      return {
        default: () => '缓存标签页',
      };
    },
  },
  {
    component: 'Checkbox',
    dependencies: {
      show: (values) => {
        return ['embedded', 'menu'].includes(values.type);
      },
      triggerFields: ['type'],
    },
    fieldName: 'meta.affix_tab',
    renderComponentContent() {
      return {
        default: () => '固定在标签',
      };
    },
  },
  {
    component: 'Checkbox',
    dependencies: {
      show: (values) => {
        return !['button'].includes(values.type);
      },
      triggerFields: ['type'],
    },
    fieldName: 'meta.hide_in_menu',
    renderComponentContent() {
      return {
        default: () => '隐藏菜单',
      };
    },
  },
  {
    component: 'Checkbox',
    dependencies: {
      show: (values) => {
        return ['catalog', 'menu'].includes(values.type);
      },
      triggerFields: ['type'],
    },
    fieldName: 'meta.hide_children_in_menu',
    renderComponentContent() {
      return {
        default: () => '隐藏子菜单',
      };
    },
  },
  {
    component: 'Checkbox',
    dependencies: {
      show: (values) => {
        return !['button', 'link'].includes(values.type);
      },
      triggerFields: ['type'],
    },
    fieldName: 'meta.hide_in_breadcrumb',
    renderComponentContent() {
      return {
        default: () => '在面包屑中隐藏',
      };
    },
  },
  {
    component: 'Checkbox',
    dependencies: {
      show: (values) => {
        return !['button', 'link'].includes(values.type);
      },
      triggerFields: ['type'],
    },
    fieldName: 'meta.hide_in_tab',
    renderComponentContent() {
      return {
        default: () => '在标签栏中隐藏',
      };
    },
  },
];

const breakpoints = useBreakpoints(breakpointsTailwind);
const isHorizontal = computed(() => breakpoints.greaterOrEqual('md').value);

const [Form, formApi] = useVbenForm({
  commonConfig: {
    colon: true,
    formItemClass: 'col-span-2 md:col-span-1',
  },
  schema,
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2 gap-x-4',
});

const [Drawer, drawerApi] = useVbenDrawer({
  onConfirm: onSubmit,
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<SystemMenuApi.SystemMenu>();
        console.log('data', data);
      if (data?.type === 'link') {
        data.link_src = data.meta?.link;
      } else if (data?.type === 'embedded') {
        data.link_src = data.meta?.iframe_src;
      }
      if (data) {
        if (data.parent_id === 0) {
          data.parent_id = undefined;
        }
        formData.value = data;
        formApi.setValues(formData.value);
        titleSuffix.value = formData.value.meta?.title
          ? formData.value.meta.title
          : '';
      } else {
        formApi.resetForm();
        titleSuffix.value = '';
      }
    }
  },
});

async function onSubmit() {
  const { valid } = await formApi.validate();
  if (valid) {
    drawerApi.lock();
    const data =
      await formApi.getValues<
        Omit<SystemMenuApi.SystemMenu, 'children' | 'id'>
      >();
    if (data.type === 'link') {
      data.meta = { ...data.meta, link: data.link_src };
    } else if (data.type === 'embedded') {
      data.meta = { ...data.meta, iframe_src: data.link_src };
    }
    delete data.link_src;
    data.meta = JSON.stringify(data.meta);
    try {
      await (formData.value?.id
        ? updateMenu(formData.value.id, data)
        : createMenu(data));
      drawerApi.close();
      emit('success');
    } finally {
      drawerApi.unlock();
    }
  }
}
const getDrawerTitle = computed(
  () =>
    formData.value?.id
      ? '修改菜单' // $t('ui.actionTitle.edit', [$t('system.menu.name')])
      : '新增菜单', // $t('ui.actionTitle.create', [$t('system.menu.name')]),
);
</script>
<template>
  <Drawer class="w-full max-w-[800px]" :title="getDrawerTitle">
    <Form class="mx-4" :layout="isHorizontal ? 'horizontal' : 'vertical'" />
  </Drawer>
</template>
