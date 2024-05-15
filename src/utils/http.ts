import router from "@/router/index";
import { getWithExpiry } from "@/utils/storage";
import { message } from 'ant-design-vue';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';

export const SUCCESS_CODE = 2000
export const AUTHERROT_CODE = 401
export const UNCONFIRMED_MSG = 'UNCONFIRMED'
interface IRequestOptions extends AxiosRequestConfig {
  ignoreAuth?: boolean
  headers?: AxiosRequestConfig['headers'] & {
    Authorization?: string
  }
}
interface IResponse<T> extends AxiosResponse {
  data: T
}
export type USERINFO = {
  access: string
  userId: number
}
class Axios {
  private instance: AxiosInstance

  private isRefreshing = false

  private refreshSubscribers: ((token: string) => void)[] = []

  constructor() {
    this.instance = axios.create({
      timeout: 20000,
      // withCredentials: true,
      baseURL: import.meta.env.VITE_APP_BASEURL as string,
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      this.handleSuccessRequeset as any,
      this.handleErrorRequeset,
    )
    this.instance.interceptors.response.use(
      this.handleSuccessResponse,
      this.handleErrorResponse,
    )
  }

  private async handleSuccessRequeset(config: IRequestOptions) {
    const { ignoreAuth = false } = config
    if (!ignoreAuth) {
      const userInfo = getWithExpiry<USERINFO>('userinfo')
      config.headers!.Authorization =
        `JWT ${userInfo?.access}` || ``
    }
    return Promise.resolve(config)
  }

  private handleErrorRequeset = (error: any) => {
    return Promise.reject(error)
  }

  private handleSuccessResponse = (response: AxiosResponse) => {
    const originalRequest = response.config
    console.log('handleSuccessResponse:',response)
    // 成功请求
    if (
      response?.data?.code === SUCCESS_CODE ||
      response?.data?.code === 10000 ||
      response.status === 304 ||
      response.status === 204 ||
      (response.config.responseType === 'arraybuffer' &&
        response.status === 200)
    ) {
      return Promise.resolve(response.data?.data)
    }
    message.error(response?.data?.msg?.detail || '请求失败')
    if (
      response?.data?.code === AUTHERROT_CODE 
    ) {
      router.replace('/login')
    }
    return Promise.reject(response)
  }

  private handleErrorResponse = (error: any) => {
    if (error.code === 'ECONNABORTED') {
      message.error(error.message)
    } else {
      if(error.message.includes('not subscriptable')) {
        message.warn('此功能为会员功能，如需使用请在“价格”页购买会员')
      } else {
        message.error(error.message)
      }
    }
    return Promise.reject(error)
  }

  private refreshToken(): Promise<any> {
    // 发起请求刷新token
    console.log('refreshToken')
    return new Promise(() => {

    })
  }

  private subscribeTokenRefresh(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback)
  }

  private onRefreshed(newAccessToken: string) {
    this.refreshSubscribers.map((callback) => callback(newAccessToken))
  }

  public async get<T = any>(
    url: string,
    params?: any,
    options?: IRequestOptions,
  ): Promise<T> {
    return this.instance.get(url, {
      params,
      ...options,
    })
  }

  public async post<T = any>(
    url: string,
    data?: any,
    options?: IRequestOptions,
  ): Promise<T> {
    return this.instance.post(url, data, options)
  }

  public async put<T = any>(
    url: string,
    data?: any,
    options?: IRequestOptions,
  ): Promise<T> {
    return this.instance.put(url, data, options)
  }

  public async patch<T = any>(
    url: string,
    data?: any,
    options?: IRequestOptions,
  ): Promise<T> {
    return this.instance.patch(url, data, options)
  }
}

export default new Axios()
