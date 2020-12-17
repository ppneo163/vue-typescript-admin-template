// User
const tokenKey = 'accessToken';
export const getToken1 = () => {
  try {
    return JSON.parse(localStorage.getItem(tokenKey) || '');
  } catch {
    return null;
  }
};
export const getToken = () => localStorage.getItem(tokenKey);
export const setToken = (token: string) => localStorage.setItem(tokenKey, token);
export const removeToken = () => localStorage.removeItem(tokenKey);

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
