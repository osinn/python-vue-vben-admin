import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemPostApi {
  export interface SystemPost {
    [key: string]: any;
    id: string;
    name: string;
    post_code: string;
    remark?: string;
    status: string;
    sort: number;
    created_by_name: string;
    created_time: string;
    updated_by_name: string;
    updated_time: string;
  }
  export interface PageParams {
    page_num: number;
    page_size: number;
    /** 岗位名称/岗位编码 */
    search_key?: string;
    /** 状态 */
    status?: string;
  }
  export interface DeptPostQuery {
    page_num?: number;
    page_size?: number;
    dept_id: string;
    status?: number;
    checked?: boolean;
  }
}

/**
 * 分页获取列表数据
 */
async function fetchPostList(params: SystemPostApi.PageParams) {
  return requestClient.post<Array<SystemPostApi.SystemPost>>(
    '/system/post/fetchPostList',
    params,
  );
}

/**
 * 全部数据
 */
async function fetchPostListAll(data: SystemPostApi.SystemPost) {
  return requestClient.post<Array<SystemPostApi.SystemPost>>(
    '/system/post/fetchPostListAll',
    data,
  );
}

/**
 * 创建
 * @param data 创建数据
 */
async function createPost(data: Omit<SystemPostApi.SystemPost, 'id'>) {
  return requestClient.post('/system/post/add', data);
}

/**
 * 更新
 *
 * @param id ID
 * @param data 更新数据
 */
async function updatePost(
  id: string,
  data: Omit<SystemPostApi.SystemPost, 'id'>,
) {
  return requestClient.post(`/system/post/edit`, { ...data, id });
}

/**
 * 更改状态
 *
 * @param id 数据ID
 * @param data 状态
 */
async function changePostStatus(data: Recordable<any>) {
  return requestClient.post(`/system/post/changePostStatus`, data);
}

/**
 * 删除
 * @param id ID
 */
async function deletePost(id: string) {
  return requestClient.post(`/system/post/delete`, { ids: [id] });
}

/**
 * 获取部门岗位列表
 * @param deptId ID 部门ID
 */
async function getDeptPostListByDeptId(data: SystemPostApi.DeptPostQuery) {
  return requestClient.post(`/system/post/get_dept_post_list_by_dept_id`, data);
}

/**
 * 部门添加岗位
 * @param deptId ID 部门ID
 */
async function addDeptPost(data: Recordable<any>) {
  return requestClient.post(`/system/post/addDeptPost`, data);
}

/**
 * 部门删除岗位
 * @param deptId ID 部门ID
 */
async function deleteDeptPost(data: Recordable<any>) {
  return requestClient.post(`/system/post/deleteDeptPost`, data);
}

export {
  addDeptPost,
  changePostStatus,
  createPost,
  deleteDeptPost,
  deletePost,
  fetchPostList,
  fetchPostListAll,
  getDeptPostListByDeptId,
  updatePost,
};
