import axios from 'axios'
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'
import { HttpCodeEnum, ResultEnum } from '@/enums/httpEnum'
import router from '@/router' // 引入 vue-router 实例

class RequestHandler {
  private static isRefreshing = false
  private static requests: Array<(token: string) => void> = []

  public static readonly service = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API || '/api',
    timeout: 10000,
  })

  static init() {
    // 请求拦截器
    this.service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const userStore = useUserStore()
      const token = userStore.getAccessToken
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // 响应拦截器
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const { code, data, message: msg } = response.data
        if (code === ResultEnum.SUCCESS || code === ResultEnum.CREATED) {
          return data
        }
        message.error(msg || '业务请求错误')
        return Promise.reject(new Error(msg || 'Error'))
      },
      async (error) => {
        const { response, config } = error
        const status = response?.status
        console.log(error, 'error')
        // 1. 处理 401: Token 刷新逻辑
        if (status === HttpCodeEnum.UNAUTHORIZED && !config._retry) {
          return this.handle401(config)
        }

        // 2. 根据状态码重定向
        this.handleErrorStatus(status, response)

        return Promise.reject(error)
      },
    )
  }

  // 401 刷新逻辑
  private static async handle401(config: any) {
    const userStore = useUserStore()
    if (this.isRefreshing) {
      return new Promise((resolve) => {
        this.requests.push((token: string) => {
          config.headers.Authorization = `Bearer ${token}`
          resolve(this.service(config))
        })
      })
    }

    config._retry = true
    this.isRefreshing = true

    try {
      const rt = userStore.getRefreshToken
      // 调用原生 axios 避免进入死循环
      const { data: res } = await axios.post(`${config.baseURL}/user/refresh`, { refreshToken: rt })
      console.log(res, 'res')
      const { access_token, refresh_token } = res.data

      userStore.setTokens(access_token, refresh_token)

      this.requests.forEach((cb) => cb(access_token))
      this.requests = []
      return this.service(config)
    } catch (err) {
      userStore.clearAuth()
      router.push('/login')
      return Promise.reject(err)
    } finally {
      this.isRefreshing = false
    }
  }

  // 多状态码重定向处理
  private static handleErrorStatus(status: number, response: AxiosResponse) {
    switch (status) {
      case HttpCodeEnum.FORBIDDEN:
        router.push('/403')
        break
      case HttpCodeEnum.NOT_FOUND:
        router.push('/404')
        break
      case HttpCodeEnum.SERVER_ERROR:
        router.push('/500')
        message.error('服务器内部错误，请联系管理员')
        break
      default:
        message.error(response.data.message)
    }
  }
}

RequestHandler.init()
export default RequestHandler.service
