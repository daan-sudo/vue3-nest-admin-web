import request from '@/utils/request'
import type { Captcha, LoginData, Token, UserInfo } from '@/views/Login/types'

// 获取验证码接口
export function getCaptchaApi(): Promise<Captcha> {
  return request({
    url: '/user/captcha', // 对应 Nest 中的 @Get('captcha')
    method: 'get',
  })
}

// 登录接口
export function loginApi(data: LoginData): Promise<Token> {
  return request({
    url: '/user/login',
    method: 'post',
    data,
  })
}

// 更新用户信息
export function updateProfileApi(data: Partial<UserInfo>): Promise<void> {
  return request({
    url: '/user/update',
    method: 'patch',
    data,
  })
}

// 修改密码
export function updatePwdApi(data: any): Promise<void> {
  return request({
    url: '/user/updatePassword',
    method: 'post',
    data,
  })
}
// 获取用户信息
export function getUserInfoApi(): Promise<UserInfo> {
  return request({
    url: '/user/info',
    method: 'get',
  })
}
export function getInfoApi() {}
