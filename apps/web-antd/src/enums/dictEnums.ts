import {
  FolderIcon,
  MenuIcon,
  newspaperVariantIcon,
  NewspaperVariantMultipleOutlineIcon,
  OkButtonIcon,
} from '@vben/icons';
/**
 * 菜单类型
 */
export const menuTypes = {
  menu: { icon: MenuIcon, value: '菜单' },
  button: { icon: OkButtonIcon, value: '按钮' },
  catalog: { icon: FolderIcon, value: '目录' },
  embedded: { icon: newspaperVariantIcon, value: '内嵌' },
  link: { icon: NewspaperVariantMultipleOutlineIcon, value: '外链' },
};

export const menuTypeIcon = (value: string) => {
  const currentIcon =
    menuTypes[value as 'button' | 'catalog' | 'embedded' | 'link' | 'menu'];
  return currentIcon.icon;
};
