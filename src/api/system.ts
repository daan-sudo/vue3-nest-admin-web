import request from '@/utils/request'
import type {
  Menu,
  MenuListQuery,
  MenuCreate,
  RoleQuery,
  Role,
  RoleRes,
  RoleCreate,
  UserQuery,
  UserResponse,
} from '@/views/System/types'
// 获取菜单列表
export function getMenuListApi(params?: MenuListQuery): Promise<Menu[]> {
  return request({
    url: '/system/menuList',
    method: 'get',
    params,
  })
}
// 根据用户获取菜单
export function getUserMenuApi(userId: string): Promise<Menu[]> {
  return request({
    url: '/system/menu/listByUser',
    method: 'get',
    params: { userId },
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

// 创建角色
export function createRoleApi(data: RoleCreate): Promise<string> {
  return request({
    url: '/system/role/add',
    method: 'post',
    data,
  })
}
// 更新角色
export function updateRoleApi(data: RoleCreate): Promise<string> {
  return request({
    url: '/system/role/update',
    method: 'post',
    data,
  })
}
// 删除角色
export function deleteRoleApi(id: number): Promise<string> {
  return request({
    url: '/system/role/delete',
    method: 'post',
    data: { id },
  })
}
// 获取用户列表
export function getUserListApi(params?: UserQuery): Promise<UserResponse> {
  return request({
    url: '/system/user/list',
    method: 'get',
    params,
  })
}
// 获取部门列表
export function getDeptListApi(): Promise<any> {
  return request({
    url: '/system/dept/list',
    method: 'get',
  })
}
// 创建用户
export function createUserApi(data: any): Promise<string> {
  return request({
    url: '/system/user/add',
    method: 'post',
    data,
  })
}
// 更新用户
export function updateUserApi(data: any): Promise<string> {
  return request({
    url: '/system/user/update',
    method: 'post',
    data,
  })
}
// 上传头像接口
export function uploadApi(data: any): Promise<{ url: string }> {
  return request({
    url: '/system/upload/avatar',
    method: 'post',
    data,
  })
}
