import { getCurrentIp, getIpInfo, reqIp123_Risk, reqScamalytics_Risk } from '@/api/ipInfo'
import type { Risk_Info, RootObject } from '@/api/types'
import chance from 'chance'

import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

type Personal = {
  name: string
  phone: string
  street: string
}

export const useIpInfoStore = defineStore(
  'ipInfo',
  () => {
    const ipInfoList = ref<RootObject>()
    const IP = ref<string>()
    const personal = reactive<Personal>({
      name: '',
      phone: '',
      street: ''
    })
    const risk_Info = reactive<Risk_Info>({
      ip123: {
        risk: '',
        score: ''
      },
      scamalytics: {
        risk: '',
        score: ''
      }
    })
    const getIpInfoData = async (ip: string) => {
      try {
        const res = await getIpInfo(ip)
        ipInfoList.value = res
      } catch (err) {
        return new Error((<Error>err).message)
      }
    }

    const getIP = async () => {
      const result = await getCurrentIp()
      IP.value = result.ip
      getIpInfoData(IP.value)
      getPersonaInfo()
    }

    const getPersonaInfo = (country: string = 'us') => {
      const Chance = chance()
      //姓名
      personal.name = Chance.name({
        gender: 'female'
      })
      //手机号 us|uk|fr
      personal.phone = Chance.phone({
        country,
        mobile: true
      })
      personal.street = Chance.address({ short_suffix: true, country: 'us' })
    }

    const getIP123_Risk = async (ip: string) => {
      const result = await reqIp123_Risk(ip)
      risk_Info.ip123 = result.data
    }

    const getScamalytics_Risk = async (token: string, ip: string) => {
      try {
        const res = await reqScamalytics_Risk(token, ip)
        risk_Info.scamalytics.risk = res.risk
        risk_Info.scamalytics.score = res.score
      } catch (err) {
        return new Error((<Error>err).message)
      }
    }

    return {
      ipInfoList,
      getIpInfoData,
      getIP,
      IP,
      personal,
      getIP123_Risk,
      risk_Info,
      getScamalytics_Risk
    }
  },
  {
    persist: {
      paths: ['IP', 'ipInfoList', 'personal']
    }
  }
)
