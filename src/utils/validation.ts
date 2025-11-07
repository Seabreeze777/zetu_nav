/**
 * 表单验证工具函数
 */

/**
 * 验证邮箱格式
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 验证URL格式
 */
export function validateURL(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * 验证密码强度
 * @param password 密码
 * @param minLength 最小长度，默认8
 * @returns { valid: boolean, message: string }
 */
export function validatePassword(password: string, minLength: number = 8): { valid: boolean; message: string } {
  if (password.length < minLength) {
    return { valid: false, message: `密码至少需要${minLength}个字符` }
  }
  
  // 检查是否包含数字
  if (!/\d/.test(password)) {
    return { valid: false, message: '密码必须包含至少一个数字' }
  }
  
  // 检查是否包含字母
  if (!/[a-zA-Z]/.test(password)) {
    return { valid: false, message: '密码必须包含至少一个字母' }
  }
  
  return { valid: true, message: '' }
}

/**
 * 验证用户名
 * 规则：3-20个字符，只能包含字母、数字、下划线
 */
export function validateUsername(username: string): { valid: boolean; message: string } {
  if (username.length < 3 || username.length > 20) {
    return { valid: false, message: '用户名长度必须在3-20个字符之间' }
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, message: '用户名只能包含字母、数字和下划线' }
  }
  
  return { valid: true, message: '' }
}

/**
 * 验证手机号（中国大陆）
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

/**
 * 验证是否为空
 */
export function validateRequired(value: string, fieldName: string = '此项'): { valid: boolean; message: string } {
  if (!value || value.trim().length === 0) {
    return { valid: false, message: `${fieldName}不能为空` }
  }
  return { valid: true, message: '' }
}

/**
 * 验证字符串长度
 */
export function validateLength(
  value: string,
  min: number,
  max: number,
  fieldName: string = '此项'
): { valid: boolean; message: string } {
  if (value.length < min) {
    return { valid: false, message: `${fieldName}至少需要${min}个字符` }
  }
  if (value.length > max) {
    return { valid: false, message: `${fieldName}不能超过${max}个字符` }
  }
  return { valid: true, message: '' }
}

/**
 * 验证数字范围
 */
export function validateNumberRange(
  value: number,
  min: number,
  max: number,
  fieldName: string = '此项'
): { valid: boolean; message: string } {
  if (value < min) {
    return { valid: false, message: `${fieldName}不能小于${min}` }
  }
  if (value > max) {
    return { valid: false, message: `${fieldName}不能大于${max}` }
  }
  return { valid: true, message: '' }
}

/**
 * 批量验证
 * @param validations 验证规则数组
 * @returns { valid: boolean, errors: string[] }
 */
export function validateBatch(
  validations: Array<{ valid: boolean; message: string }>
): { valid: boolean; errors: string[] } {
  const errors = validations.filter(v => !v.valid).map(v => v.message)
  return {
    valid: errors.length === 0,
    errors
  }
}

