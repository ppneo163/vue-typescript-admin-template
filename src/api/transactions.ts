import request from '@/utils/request';

export const getTransactions = (params: any) =>
  request({
    url: '/mock/transactions',
    method: 'get',
    params
  });
