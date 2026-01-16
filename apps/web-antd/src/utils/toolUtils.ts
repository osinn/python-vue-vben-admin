/**
 * 通用js方法封装处理
 * Copyright (c) 2024 Antflow
 */
export const isObjEmpty = (data: any) =>
  data === null ||
  data === undefined ||
  data == '' ||
  data == '{}' ||
  data == '[]' ||
  data == 'null';
export const isArrayEmpty = (data: any) =>
  Array.isArray(data) ? data.length === 0 : isObjEmpty(data);

export const ObjectUtils = {
  getDataType(data: any) {
    const temp = Object.prototype.toString.call(data);
    const type = temp.match(/\b\w+\b/g);
    return !type || type.length < 2 ? 'Undefined' : type[1];
  },
  iterable(data: any) {
    const dataType = this.getDataType(data);
    return dataType && ['Array', 'Object'].includes(dataType);
  },

  /**
   * 比较两个对象是否相等
   * @param {*} source
   * @param {*} comparison
   * @returns true 不相等 false 相等
   */
  isObjectChanged(source: any, comparison: any) {
    if (!this.iterable(source)) {
      throw new Error(
        `source should be a Object or Array , but got ${this.getDataType(source)}`,
      );
    }
    if (this.getDataType(source) !== this.getDataType(comparison)) {
      return true;
    }
    const sourceKeys = Object.keys(source);
    const comparisonKeys: any = Object.keys({ ...source, ...comparison });
    if (sourceKeys.length !== comparisonKeys.length) {
      return true;
    }
    return comparisonKeys.some((key: any) => {
      return this.iterable(source[key])
        ? this.isObjectChanged(source[key], comparison[key])
        : source[key] !== comparison[key];
    });
  },
};

export function generateUUID(simple = false) {
  let d = Date.now();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replaceAll(
    /[xy]/g,
    (c) => {
      const r = ((d + Math.random() * 16) % 16) | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    },
  );
  return simple ? uuid.replaceAll(/[-\s]/g, '') : uuid;
}

/**
 * 计算文件大小并以适当单位表示
 *
 * 此函数接收一个表示文件大小的数字（以字节为单位），并返回一个格式化后的字符串，
 * 该字符串表示文件的大小，以最适合的单位（B, KB, MB, GB, TB）表示
 *
 * @param size 文件大小，以字节为单位
 * @param isInteger 是否返回整数大小，默认为false如果设置为true，
 *                    则返回的大小将不包含小数部分；如果为false，则根据单位的不同，
 *                    返回最多3位小数的大小
 * @returns 格式化后的文件大小字符串，如"4.5KB"或"3MB"
 */
export function calculateFileSize(size: number, isInteger = false) {
  // 定义文件大小的单位数组
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  // 定义换算基数，1KB = 1024B，1MB = 1024KB，以此类推
  const base = 1024;

  // 初始化单位索引，初始值为0，即默认单位为B
  let unitIndex = 0;
  // 当文件大小大于等于基数且单位索引未超出单位数组范围时，循环进行单位转换
  while (size >= base && unitIndex < units.length - 1) {
    size /= base;
    unitIndex++;
  }

  // 根据是否需要整数大小，确定输出的精度
  const precision = isInteger ? 0 : Math.min(unitIndex, 3);
  // 返回格式化后的文件大小字符串
  return `${size.toFixed(precision)}${units[unitIndex]}`;
}

/**
 * 跟后台逻辑一致
 * Number.isSafeInteger形参只能为Number类型 其他的直接返回false
 * @param str 数字
 * @returns 安全数内返回number类型 否则返回原字符串
 */
export function safeParseNumber(str: string): number | string {
  const num = Number(str);
  return Number.isSafeInteger(num) ? num : str;
}
