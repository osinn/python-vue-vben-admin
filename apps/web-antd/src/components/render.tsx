import type { Component as ComponentType } from 'vue';

import { h } from 'vue';

import {
  AndroidIcon,
  BaiduIcon,
  ChromeIcon,
  DefaultBrowserIcon,
  DefaultOsIcon,
  DingtalkIcon,
  EdgeIcon,
  FirefoxIcon,
  IconifyIcon,
  IPhoneIcon,
  LinuxIcon,
  MicromessengerIcon,
  OperaIcon,
  OSXIcon,
  QuarkIcon,
  SafariIcon,
  SvgQQIcon,
  UcIcon,
  WindowsIcon,
} from '@vben/icons';

import { Tag } from 'ant-design-vue';

/**
 * 浏览器图标
 * cn.hutool.http.useragent -> browers
 */
const browserOptions = [
  { icon: ChromeIcon, value: 'chrome' },
  { icon: EdgeIcon, value: 'edge' },
  { icon: FirefoxIcon, value: 'firefox' },
  { icon: OperaIcon, value: 'opera' },
  { icon: SafariIcon, value: 'safari' },
  { icon: MicromessengerIcon, value: 'micromessenger' },
  { icon: MicromessengerIcon, value: 'windowswechat' },
  { icon: QuarkIcon, value: 'quark' },
  { icon: MicromessengerIcon, value: 'wxwork' },
  { icon: SvgQQIcon, value: 'qq' },
  { icon: DingtalkIcon, value: 'dingtalk' },
  { icon: UcIcon, value: 'uc' },
  { icon: BaiduIcon, value: 'baidu' },
];

/**
 * 操作系统图标
 * cn.hutool.http.useragent -> os
 */
const osOptions = [
  { icon: WindowsIcon, value: 'windows' },
  { icon: LinuxIcon, value: 'linux' },
  { icon: OSXIcon, value: 'os' },
  { icon: AndroidIcon, value: 'android' },
  { icon: IPhoneIcon, value: 'iphone' },
];

export function renderIconSpan(
  icon: ComponentType,
  value: string,
  center = false,
  marginLeft = '2px',
) {
  const justifyCenter = center ? 'justify-center' : '';

  return (
    <span class={['flex', 'items-center', justifyCenter]}>
      {h(icon)}
      <span style={{ marginLeft }}>{value}</span>
    </span>
  );
}

export function renderBrowserIcon(browser: string | undefined, center = true) {
  if (!browser) {
    return;
  }
  const current = browserOptions.find((item) =>
    browser.toLocaleLowerCase().includes(item.value),
  );
  const icon = current ? current.icon : DefaultBrowserIcon;
  return renderIconSpan(icon, browser, center, '5px');
}

/**
 * 渲染操作系统图标
 *
 * @param os 操作系统
 * @param center
 * @returns
 */
export function renderOsIcon(value: string | undefined, center = true) {
  if (!value) {
    return;
  }
  /**
   *  Windows 10 or Windows Server 2016 太长了 分割一下 详情依旧能看到详细的
   */
  let os = value;
  const split = os.split(' or ');
  if (split.length === 2) {
    os = split[0] || 'PC';
  }
  let current = osOptions.find((item) =>
    os.toLocaleLowerCase().includes(item.value),
  );
  // windows要特殊处理
  if (os.toLocaleLowerCase().includes('windows')) {
    current = osOptions[0];
  }

  if (
    os.toLocaleLowerCase().includes('osx') ||
    os.toLocaleLowerCase().includes('mac') ||
    os.toLocaleLowerCase().includes('OS X')
  ) {
    current = osOptions[2];
  }
  const icon = current ? current.icon : DefaultOsIcon;
  return renderIconSpan(icon, os, center, '5px');
}

/**
 * iconify图标
 * @param icon icon名称
 * @returns render
 */
export function renderIcon(icon: string) {
  return <IconifyIcon icon={icon}></IconifyIcon>;
}

/**
 * 渲染标签
 * @param text 文字
 * @param color 颜色
 * @returns render
 */
function renderTag(text: string, color?: string) {
  return <Tag color={color}>{text}</Tag>;
}

/**
 *
 * @param tags 标签list
 * @param wrap 是否换行显示
 * @param [gap] 间隔
 * @returns render
 */
export function renderTags(tags: string[], wrap = false, gap = 1) {
  return (
    <div
      class={['flex', wrap ? 'flex-col' : 'flex-row']}
      style={{ gap: `${gap}px` }}
    >
      {tags.map((tag, index) => {
        return <div key={index}>{renderTag(tag)}</div>;
      })}
    </div>
  );
}
