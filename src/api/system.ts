import request from '@/utils/request'
import type {
  Menu,
  MenuListQuery,
  MenuCreate,
  RoleQuery,
  Role,
  RoleRes,
} from '@/views/System/types'
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
// 更新菜单
export function updateMenuApi(data: MenuCreate): Promise<string> {
  return request({
    url: '/system/menu/update',
    method: 'post',
    data,
  })
}
// 删除菜单
export function deleteMenuApi(id: string): Promise<string> {
  return request({
    url: '/system/menu/delete',
    method: 'post',
    data: { id },
  })
}
// 分页获取角色列表
export function getRoleListApi(params?: RoleQuery): Promise<RoleRes> {
  return request({
    url: '/system/roleList',
    method: 'get',
    params,
  })
}
