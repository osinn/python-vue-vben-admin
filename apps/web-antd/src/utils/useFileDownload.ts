import type { RequestResponse } from '@vben/request';

import { useAppConfig } from '@vben/hooks';

import { requestClient } from '#/api/request';

const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);
/**
 * 下载文件，获取完整的Response
 * @returns RequestResponse<Blob>
 */
async function downloadFile2() {
  requestClient.request;
  return requestClient.download<RequestResponse<Blob>>(
    'https://unpkg.com/@vbenjs/static-source@0.1.7/source/logo-v1.webp',
    {
      responseReturn: 'raw',
    },
  );
}

export default function useFileDownload() {
  const downloadFile = async (
    url: string,
    params = {},
    method = 'post',
    filename = '',
  ) => {
    try {
      const response = await requestClient.request(url, {
        method,
        url,
        data: method.toLowerCase() === 'post' ? params : undefined,
        params: method.toLowerCase() === 'get' ? params : undefined,
        responseType: 'blob',
      });
      console.log('生成响应：：：', response);
      // // 尝试从响应头获取文件名
      // const contentDisposition = response.headers['content-disposition'];
      // let finalFilename = filename;
      // if (contentDisposition) {
      //   const filenameMatch = contentDisposition.match(/filename="?(.+?)"?(;|$)/);
      //   if (filenameMatch && filenameMatch.length > 1) {
      //     finalFilename = filenameMatch[1];
      //   }
      // }

      // const blob = new Blob([response.data]);
      // const downloadUrl = window.URL.createObjectURL(blob);
      // const link = document.createElement('a');
      // link.href = downloadUrl;
      // link.download = finalFilename;
      // document.body.appendChild(link);
      // link.click();

      // window.URL.revokeObjectURL(downloadUrl);
      // document.body.removeChild(link);

      return true;
    } catch (error) {
      console.error('下载失败:', error);
      throw error;
    }
  };

  function postDownload(url: string, params: any) {
    console.log('下载参数：', params);
    // accessStore.accessToken
    const formEl = document.createElement('form');
    formEl.setAttribute('action', apiURL + url);
    formEl.setAttribute('method', 'post');
    formEl.setAttribute('target', '_blank');
    for (const key in params) {
      if (params[key]) {
        const inptEl = document.createElement('input');
        inptEl.setAttribute('type', 'hidden');
        inptEl.setAttribute('name', key);
        inptEl.setAttribute('value', params[key]);
        formEl.append(inptEl);
      }
    }
    document.body.append(formEl);
    formEl.submit();
    formEl.remove();
  }

  return { downloadFile, postDownload };
}
