/***
 * 获取指定长度的随机字符串
 * @param n  指定的字符串
 * @return tmp 返回的字符串
 */
export const randomString = (n: number): string => {
  const str = 'abcdefghijklmnopqrstuvwxyz9876543210';
  let tmp = '';
  const l = str.length;
  for (let i = 0; i < n; i++) {
    tmp += str.charAt(Math.floor(Math.random() * l));
  }
  return tmp;
};
