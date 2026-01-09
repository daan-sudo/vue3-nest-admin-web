export interface Captcha {
  captchaKey: string
  svg: string
}
export interface LoginData {
  username: string
  password: string
  captchaKey: string
  captcha: string
}
export interface UserInfo {
  username: string
  avatar: string
  email: string
  phone: string
  role: any

  id: string
  deptId: string
  department: any
  remark: string
  createTime: Date
  nickName: string
  sex: number
}
export interface Token {
  access_token: string
  refresh_token: string
}
