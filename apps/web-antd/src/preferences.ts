import { defineOverridesPreferences } from '@vben/preferences';

/**
 * @description 项目配置文件
 * 只需要覆盖项目中的一部分配置，不需要的配置不用覆盖，会自动使用默认配置
 * !!! 更改配置后请清空缓存，否则可能不生效
 */
export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    name: import.meta.env.VITE_APP_TITLE,
    accessMode: 'backend',
    enablePreferences: false,
  },
  logo: {
    enable: true,
    fit: 'contain',
    source:
      'https://foruda.gitee.com/avatar/1742123137744217697/992057_w160_1742123137.png!avatar200',
  },
  widget: {
    themeToggle: false,
  },
  theme: {
    mode: 'light',
  },
  footer: {
    enable: false,
  },
  copyright: {
    enable: false,
  },
});
