import { requestClient } from '#/api/request';

export namespace FormDesignApi {
  export interface FormDesign {
    [key: string]: any;
    /** 主键 */
    id: string;

    /** 表单标题 */
    title: string;

    /** 排序 */
    sort: string;

    /** 备注 */
    remarks: string;

    /** 创建人 */
    createdBy: string;

    /** 创建时间 */
    createdTime: string;

    /** 更新人 */
    updatedBy: string;

    /** 更新时间 */
    updatedTime: string;
  }
  export interface FormDesignPageParam {
    [key: string]: any;
    /** 表单标题 */
    title: string;

    /** 创建时间 */
    createdTime: string;
  }
}

/**
 * 查询表单设计列表
 */
async function getFormDesignList(data: FormDesignApi.FormDesignPageParam) {
  return requestClient.post<Array<FormDesignApi.FormDesign>>(
    '/systool/formDesign/getSysFormDesignList',
    data,
  );
}

/**
 * 获取表单设计详细信息
 */
async function getSysFormDesignInfo(id: any) {
  return requestClient.post<Array<FormDesignApi.FormDesign>>(
    `/systool/formDesign/${id}/getSysFormDesignInfo`,
    {},
  );
}

/**
 * 新增表单设计
 * @param data 新增数据
 */
async function createFormDesign(data: Omit<FormDesignApi.FormDesign, 'id'>) {
  return requestClient.post('/systool/formDesign/createSysFormDesign', data);
}

/**
 * 更新表单设计
 *
 * @param id ID
 * @param data 更新数据
 */
async function updateFormDesign(
  id: string,
  data: Omit<FormDesignApi.FormDesign, 'id'>,
) {
  return requestClient.post(`/systool/formDesign/editSysFormDesign`, {
    ...data,
    id,
  });
}

/**
 * 删除
 * @param id ID
 */
async function deleteFormDesign(id: string) {
  return requestClient.post(`/systool/formDesign/deleteSysFormDesignByIds`, {
    ids: [id],
  });
}

export {
  createFormDesign,
  deleteFormDesign,
  getFormDesignList,
  updateFormDesign,
};
