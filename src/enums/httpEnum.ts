export enum ResultEnum {
  SUCCESS = 200,
  CREATED = 201,
  ERROR = 500,
  TIMEOUT = 408,
}

export enum HttpCodeEnum {
  UNAUTHORIZED = 401, // 未授权/Token过期
  FORBIDDEN = 403, // 无权限访问
  NOT_FOUND = 404, // 资源不存在
  SERVER_ERROR = 500, // 服务器错误
}

export enum StorageKeyEnum {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  USER_INFO = 'USER_INFO',
}
