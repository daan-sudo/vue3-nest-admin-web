import type { ComputedRef } from 'vue'
export type Menu = {
  id: string
  name: string
  path: string
  icon: string
  children?: Menu[]
  orderNum: number
  createTime: Date
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
