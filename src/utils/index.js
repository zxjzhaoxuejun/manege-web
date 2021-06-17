/**
*
*@param{(Object|string|number)}time
*@param{string}cFormat
*@param{Boolean} monthAbbreiation 是否显示月份英文简称
@param{Boolean} showWeek 是否显示星期
*@returns{string|null}
*/
export function parseTime(time, format = '{y}-{m}-{d} {h}:{i}:{s}', monthAbbreiation = false, showWeek = false) {
  if (arguments.length === 0 || !time) {
    return null
  }
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        time = parseInt(time)
      } else {
        // support safari

      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    if (key === 'm' && monthAbbreiation) { return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][value - 1] }
    // Note:getDay()returns 0 on Sunday
    if (key === 'a' && showWeek) { return ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'][value] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}
