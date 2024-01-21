import axios, { AxiosInstance } from 'axios'
import getConfig from 'next/config'

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'ACCESS_TOKEN',
  REFRESH_TOKEN: 'REFRESH_TOKEN'
}

export const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

request.interceptors.request.use(function (config) {
  config.headers['Accept'] = 'application/json'
  return config
})
request.interceptors.response.use(function (response) {
  return response.data
})

let refreshProcess: Promise<unknown> | undefined

export const requestAuthenticated = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

requestAuthenticated.interceptors.request.use(async function (config) {
  config.headers['Accept'] = 'application/json'
  let accessToken: null | string = null
  if (typeof localStorage !== 'undefined') {
    accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  }
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`
  }
  return config
})

requestAuthenticated.interceptors.response.use(
  function (response) {
    return response.data
  },
  async function (error) {
    // Try to refresh token in this case
    // if (
    //   axios.isAxiosError(error) &&
    //   error.response?.status === 401
    //   // &&
    //   // error.config &&
    //   // !('_retry' in error.config && !error.config._retry)
    // ) {
    //   // const authenticationInfo = await refreshProcessHandler(true)
    //   // if (error.config?.headers) {
    //   //   error.config.headers['Authorization'] = `Bearer ${authenticationInfo?.accessToken}`
    //   // }
    //   // // @ts-ignore
    //   // error.config._retry = true
    //   // return request.request(error.config || {})
    //   // const authenticationInfo = authenticationSession.getAuthentication()
    //   return
    // }

    return Promise.reject(error)
  }
)

async function refreshProcessHandler(condition: boolean) {
  // let authenticationInfo = authenticationSession.getAuthentication()
  // if (!refreshProcess && condition) {
  //   refreshProcess = refreshToken().then((result) => {
  //     refreshProcess = undefined
  //     return result
  //   })
  // }
  // if (refreshProcess) {
  //   authenticationInfo = await refreshProcess
  // }
  // return authenticationInfo
}