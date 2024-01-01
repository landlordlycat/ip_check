import { request, $axios } from '@/utils/request'
import type { Ip123_Risk, RootObject, Scamalytics_Risk } from './types'
import axios from 'axios'

enum Api {
  //欺诈查询
  ip123_Risk = import.meta.env.VITE_APP_URL_ip123_Risk,
  scamalytics_Risk = import.meta.env.VITE_APP_URL_scamalytics_Risk
}

//查询ip信息
export const getIpInfo = (ip: string) => {
  return request<any, RootObject>({
    method: 'get',
    url: `/?q=${ip}`
  })
}
//查询本机ip
export const getCurrentIp = (): Promise<{
  ip: string
}> => {
  return $axios.get('/?format=json')
}

//ip123
export const reqIp123_Risk = async (ip: string): Promise<Ip123_Risk> => {
  const result = (await axios.get(Api.ip123_Risk + ip)).data
  return result
}

export const reqScamalytics_Risk = async (token: string, ip: string): Promise<Scamalytics_Risk> => {
  const result = await (await axios.get(Api.scamalytics_Risk + token + '&ip=' + ip)).data
  return result
}
