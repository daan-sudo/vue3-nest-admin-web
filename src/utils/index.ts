import dayjs from 'dayjs'
/** @description: 获取当前时间 */
export const timeFix = () => {
  const hour = dayjs().hour()
  let result = ''
  if (hour < 9) {
    result = '早上好'
  } else if (hour <= 11) {
    result = '上午好'
  } else if (hour <= 13) {
    result = '中午好'
  } else if (hour <= 20) {
    result = '下午好'
  } else {
    result = '夜深了'
  }
  return result
}
