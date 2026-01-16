import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemDeptApi {
  export interface SystemDept {
    [key: string]: any;
    /**
     * antd组件必须要这个属性，不然会告警提示缺少属性 "key"，但类型 "DataNode" 中需要该属性，但实际上没有这个属性的，声明只是为了消除提示
     */
    key: string;
    children?: SystemDept[];
    id: string;
    parent_id: any;
    name: string;
    remark?: string;
    status: 0 | 1;
  }
}

/**
 * 获取部门列表数据
 */
async function fetchDeptAllTree() {
  return requestClient.get<Array<SystemDeptApi.SystemDept>>(
    '/system/dept/get_dept_all_tree',
  );
}

/**
 * 获取部门树形列表数据
 */
async function fetchSimpleDeptAllTree() {
  return requestClient.get<Array<SystemDeptApi.SystemDept>>(
    '/system/dept/get_simple_dept_all_tree',
  );
}

/**
 * 创建部门
 * @param data 部门数据
 */
async function createDept(
  data: Omit<SystemDeptApi.SystemDept, 'children' | 'id'>,
) {
  return requestClient.post('/system/dept/add_dept', data);
}

/**
 * 更新部门
 *
 * @param id 部门 ID
 * @param data 部门数据
 */
async function updateDept(
  id: string,
  data: Omit<SystemDeptApi.SystemDept, 'children' | 'id'>,
) {
  return requestClient.put(`/system/dept/edit_dept`, { ...data, id });
}

/**
 * 删除部门
 * @param id 部门 ID
 */
async function deleteDept(id: string) {
  return requestClient.post(`/system/dept/${id}/delete_dept`);
}

/**
 * 获取全部部门类型
 */
async function fetchOrgTypeAll() {
  return requestClient.post(`/system/dept/fetchOrgTypeAll`);
}

/**
 * 更改状态
 *
 * @param id 数据ID
 * @param data 状态
 */
async function changeDeptStatus(data: Recordable<any>) {
  return requestClient.post(`/system/dept/changeDeptStatus`, data);
}

export {
  changeDeptStatus,
  createDept,
  deleteDept,
  fetchDeptAllTree,
  fetchOrgTypeAll,
  // 仅获取部门树形列表数据
  fetchSimpleDeptAllTree,
  updateDept,
};
