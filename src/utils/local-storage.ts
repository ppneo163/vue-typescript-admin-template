/**
 * @Author: LiangDong
 * @Desc: localStorage 操作
 * @Date: 2020/12/18
 * @Time: 下午6:17
*/

/**
 * localStorage 设置一个key + value
 * @param key
 * @param value 字符串 | json对象
 */
export const localStorage_set = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

/**
 * localStorage 获取一个key的value
 * @param key
 * @returns 返回 字符串 | json数据 | null
 */
export const localStorage_get = (key: string) => {
  if (!key) {
    return null;
  }
  try {
    return JSON.parse(localStorage.getItem(key) || '');
  } catch {
    return null;
  }
};

/**
 * localStorage 删除一个key
 * @param key
 */
export const localStorage_remove = (key: string) => {
  localStorage.removeItem(key);
};

const tokenKey = 'accessToken';
export const getToken = () => localStorage.getItem(tokenKey);
export const setToken = (token: string) => localStorage.setItem(tokenKey, token);
export const removeToken = () => localStorage.removeItem(tokenKey);

export const localStorage_get_token = () => localStorage_get(tokenKey);
export const localStorage_set_token = (token: string) => localStorage_set(tokenKey, token);
export const localStorage_del_token = () => localStorage_remove(tokenKey);

const userKey = 'user';
export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem(userKey) || '');
  } catch {
    return null;
  }
};
export const setUser = (user: any) => localStorage.setItem(userKey, JSON.stringify(user));
export const removeUser = () => localStorage.removeItem(userKey);
