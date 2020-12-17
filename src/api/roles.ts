import request from '@/utils/request';

export const getRoles = (params: any) =>
  request({
    url: '/mock/roles',
    method: 'get',
    params
  });

export const createRole = (data: any) =>
  request({
    url: '/mock/roles',
    method: 'post',
    data
  });

export const updateRole = (id: number, data: any) =>
  request({
    url: `/mock/roles/${id}`,
    method: 'put',
    data
  });

export const deleteRole = (id: number) =>
  request({
    url: `/mock/roles/${id}`,
    method: 'delete'
  });

export const getRoutes = (params: any) =>
  request({
    url: '/mock/routes',
    method: 'get',
    params
  });
