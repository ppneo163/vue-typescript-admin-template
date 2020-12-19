import request from '@/utils/request';

export const getUsers = (params: any) =>
  request({
    url: '/mock/users',
    method: 'get',
    params
  });

export const getUserByName = (username: string) =>
  request({
    url: `/mock/users/${username}`,
    method: 'get'
  });

export const updateUser = (username: string, data: any) =>
  request({
    url: `/mock/users/${username}`,
    method: 'put',
    data
  });

export const deleteUser = (username: string) =>
  request({
    url: `/mock/users/${username}`,
    method: 'delete'
  });

export const logout = () =>
  request({
    url: '/mock/users/logout',
    method: 'post'
  });

export const register = (data: any) =>
  request({
    url: '/mock/users/register',
    method: 'post',
    data
  });

/**
 * 登录
 * @param data
 */
export const login = (data: any) =>
  request({
    url: 'shopping/v1/merchant/user/unauth/login',
    method: 'post',
    data
  });

/**
 * 获取登录店铺列表
 * @param phone
 */
export const getShopLit = (phone: any) =>
  request({
    url: `shopping/v1/merchant/user/shop/${phone}`,
    method: 'get'
  });

/***
 * 获取用户信息
 * @param id
 */
export const getUserInfo = (id: any) =>
  request({
    url: `shopping/v1/merchant/user/detail/${id}`,
    method: 'get'
  });
