// 判断字符串是否为空
export function isEmpty(str) {
  if (str === null || str === undefined || str.length === 0) {
    return true;
  }
  return false;
}
