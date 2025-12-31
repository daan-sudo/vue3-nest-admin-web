import request from '@/utils/request'
import type { Menu, MenuListQuery, MenuCreate } from '@/views/System/types'
// 获取菜单列表
export function getMenuListApi(params?: MenuListQuery): Promise<Menu[]> {
  return request({
    url: '/system/menuList',
    method: 'get',
    params,
  })
}
// 创建菜单
export function createMenuApi(data: MenuCreate): Promise<string> {
  return request({
    url: '/system/menu/add',
    method: 'post',
    data,
  })
}
