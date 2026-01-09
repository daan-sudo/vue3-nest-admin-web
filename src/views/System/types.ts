import type { ComputedRef } from 'vue'
export type Menu = {
  id: string | undefined | number
  name: string
  path?: string
  icon?: string
  children?: Menu[]
  orderNum?: number
  createTime?: Date
}
export type MenuListQuery = {
  name: string
  path: string
  createTime?: string[]
  createTimeStart?: string | undefined // reactive 会解包 ComputedRef
  createTimeEnd?: string | undefined
}
export type MenuCreate = {
  id?: string
  type: number
  name: string
  path: string
  icon: string
  parentId: string | undefined
  orderNum: number
}
export type RoleQuery = {
  id?: string
  pageSize: number
  current: number
  name?: string
  code?: string
  createTime?: string[]
  createTimeStart?: string | undefined // reactive 会解包 ComputedRef
  createTimeEnd?: string | undefined
}
export type Role = {
  id: number
  name: string
  code: string
  createTime?: Date
  remark: string
  orderNum: number
}
export type RoleCreate = {
  id?: number
  name: string
  code: string
  remark: string
  orderNum: number
  menuIds: number[]
}
export type RoleRes = {
  total: number
  records: Role[]
  current: number
  pageSize: number
}
export type UserQuery = {
  username: string
  status: string
}
export type User = {
  id: number
  username: string
  nickname: string
  avatar: string
  email: string
  phone: string
  sex: string
  status: string
  createTime?: Date
  role: any
}
export type UserResponse = {
  total: number
  records: User[]
  current: number
  pageSize: number
}
