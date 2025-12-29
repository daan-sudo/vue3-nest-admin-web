import request from '@/utils/request'
import type { Captcha, LoginData, UserInfo } from '@/views/Login/types'

// 获取验证码接口
export function getCaptchaApi(): Promise<Captcha> {
  return request({
    url: '/user/captcha', // 对应 Nest 中的 @Get('captcha')
    method: 'get',
  })
}

// 登录接口
export function loginApi(data: LoginData): Promise<UserInfo> {
  return request({
    url: '/user/login',
    method: 'post',
    data,
  })
}
