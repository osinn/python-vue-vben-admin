/**
 * 存储相关
 */
export const useSystemStore = {
  // 存储数据
  setStore(key: string, value: string) {
    localStorage.setItem(key, value);
  },

  // 获取数据
  getStore(key: string): null | string {
    return localStorage.getItem(key);
  },

  // 删除数据
  removeStore(key: string) {
    localStorage.removeItem(key);
  },
};
