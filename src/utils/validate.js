
/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

export function validPassword(password) {
  const reg = /^(?=.*\d)(?=.*[a-zA-Z]).{6,20}$/
  return reg.test(password)
}

/**
 * @param {必填，数字，长度≤30个字符，输入框提示语 Phone} val
 */
export function validPhone(val) {
  const reg = /^1[23456789]\d{9}$/
  return reg.test(val)
}

/**
 * 字符类型不限，长度≤255个字符
 * @param {字符类型不限，} val
 */
export function validStringLen(val, num = 255) {
  const rule = `^.{0,${num}}`
  const reg = new RegExp(rule + '$') // /^.{0,255}$/
  return reg.test(val)
}

/**
 * Please don't input illegal character.
 * 非法字符校验
 */
export const isIllegalCharCheck = (val) => {
  return /^.*[!@$*+<>&'\"%\\\\].*$/.test(val)
}

/**
 * 只允许使用数字、空格、-和()
 * Only Numbers, "space", "-" and "()" is allowed.
 */
export const onlyNumAndSpace = (val) => {
  return /[^\s\d\-()]/g.test(val)
}
/**
 * Please enter valid name entry using letters only.
 * 纯数字检验
 */
export const onlyNumber = (val) => {
  return /^\d+$/.test(val)
}
