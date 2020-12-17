import request from '@/utils/request';

export const getUsers = (params: any) =>
  request({
    url: '/mock/users',
    method: 'get',
    params
  });

export const getUserInfo = (data: any) =>
  request({
    url: '/mock/users/info',
    method: 'post',
    data
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

export const login = (data: any) =>
  request({
    url: '/mock/users/login',
    method: 'post',
    data
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

export const getShopLit = (phone: any) =>
  request({
    url: `shopping/v1/merchant/user/shop/${phone}`,
    method: 'get'
  });
