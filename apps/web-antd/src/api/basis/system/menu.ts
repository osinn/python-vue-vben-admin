import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemMenuApi {
  /** 徽标颜色集合 */
  export const BadgeVariants = [
    'default',
    'destructive',
    'primary',
    'success',
    'warning',
  ] as const;
  /** 徽标类型集合 */
  export const BadgeTypes = ['dot', 'normal'] as const;
  /** 菜单类型集合 */
  export const MenuTypes = [
    'catalog',
    'menu',
    'embedded',
    'link',
    'button',
  ] as const;
  /** 系统菜单 */
  export interface SystemMenu {
    [key: string]: any;
    /**
     * antd组件必须要这个属性，不然会告警提示缺少属性 "key"，但类型 "DataNode" 中需要该属性，但实际上没有这个属性的，声明只是为了消除提示
     */
    key: string;
    // 可以用于 antd组件 Tree 组件自定义复选框选中状态值
    checkedChildrenAll: boolean;
    /** 后端权限标识 */
    auth_code: string;
    /** 子级 */
    children?: SystemMenu[];
    /** 组件 */
    component?: string;
    /** 菜单ID */
    id: string;
    /** 菜单元数据 */
    meta?: {
      /** 激活时显示的图标 */
      activeIcon?: string;
      /** 作为路由时，需要激活的菜单的Path */
      activePath?: string;
      /** 固定在标签栏 */
      affixTab?: boolean;
      /** 在标签栏固定的顺序 */
      affixTabOrder?: number;
      /** 徽标内容(当徽标类型为normal时有效) */
      badge?: string;
      /** 徽标类型 */
      badgeType?: (typeof BadgeTypes)[number];
      /** 徽标颜色 */
      badgeVariants?: (typeof BadgeVariants)[number];
      /** 在菜单中隐藏下级 */
      hideChildrenInMenu?: boolean;
      /** 在面包屑中隐藏 */
      hideInBreadcrumb?: boolean;
      /** 在菜单中隐藏 */
      hideInMenu?: boolean;
      /** 在标签栏中隐藏 */
      hideInTab?: boolean;
      /** 菜单图标 */
      icon?: string;
      /** 内嵌Iframe的URL */
      iframeSrc?: string;
      /** 是否缓存页面 */
      keepAlive?: boolean;
      /** 外链页面的URL */
      link?: string;
      /** 同一个路由最大打开的标签数 */
      maxNumOfOpenTab?: number;
      /** 无需基础布局 */
      noBasicLayout?: boolean;
      /** 是否在新窗口打开 */
      openInNewWindow?: boolean;
      /** 菜单排序 */
      order?: number;
      /** 额外的路由参数 */
      query?: Recordable<any>;
      /** 菜单标题 */
      title?: string;
    };
    /** 菜单名称 */
    name: string;
    /** 路由路径 */
    path: string;
    /** 父级ID */
    pid: string;
    /** 重定向 */
    redirect?: string;
    /** 菜单类型 */
    type: (typeof MenuTypes)[number];
  }
}

/**
 * 获取菜单数据列表
 */
async function fetchMenuList() {
  return requestClient.post<Array<SystemMenuApi.SystemMenu>>(
    '/system/sysMenu/fetchMenuList',
    {},
  );
}

/**
 * 获取菜单数据列表
 */
async function fetchMenuTreeListAll(data: Recordable<any>) {
  return requestClient.get<Array<SystemMenuApi.SystemMenu>>(
    '/system/menu/get_menu_tree_list_all',
    { params: data },
  );
}

async function isMenuNameExists(
  name: string,
  id?: SystemMenuApi.SystemMenu['id'],
) {
  return requestClient.post<boolean>('/system/sysMenu/name-exists', {
    id,
    key: name,
  });
}

async function isMenuPathExists(
  path: string,
  id?: SystemMenuApi.SystemMenu['id'],
) {
  return requestClient.post<boolean>('/system/sysMenu/path-exists', {
    id,
    key: path,
  });
}

/**
 * 创建菜单
 * @param data 菜单数据
 */
async function createMenu(
  data: Omit<SystemMenuApi.SystemMenu, 'children' | 'id'>,
) {
  return requestClient.post('/system/sysMenu/add', data);
}

/**
 * 更新菜单
 *
 * @param id 菜单 ID
 * @param data 菜单数据
 */
async function updateMenu(
  id: string,
  data: Omit<SystemMenuApi.SystemMenu, 'children' | 'id'>,
) {
  return requestClient.post(`/system/sysMenu/edit`, { ...data, id });
}

/**
 * 删除菜单
 * @param id 菜单 ID
 */
async function deleteMenu(id: string) {
  return requestClient.post(`/system/sysMenu/delete`, { ids: [id] });
}

/**
 * 获取角色分配菜单ID
 * @param id 菜单 ID
 */
async function fetchAssignmentPermissionIdsByRoleId(roleId: string) {
  return requestClient.post(
    `/system/sysMenu/fetchAssignmentPermissionIdsByRoleId/${roleId}`,
  );
}

export {
  createMenu,
  deleteMenu,
  fetchAssignmentPermissionIdsByRoleId,
  fetchMenuList,
  fetchMenuTreeListAll,
  isMenuNameExists,
  isMenuPathExists,
  updateMenu,
};
