export interface RootObject {
  ip: string
  rir: string
  is_bogon: boolean
  is_mobile: boolean
  is_crawler: boolean
  is_datacenter: boolean
  is_tor: boolean
  is_proxy: boolean
  is_vpn: boolean
  is_abuser: boolean
  company: Company
  datacenter: Datacenter
  asn: Asn
  location: Location
  elapsed_ms: number
}

interface Location {
  continent: string
  country: string
  country_code: string
  state: string
  city: string
  latitude: number
  longitude: number
  zip: string
  timezone: string
  local_time: string
  local_time_unix: number
  is_dst: boolean
}

interface Asn {
  asn: number
  route: string
  descr: string
  country: string
  active: boolean
  org: string
  domain: string
  abuse: string
  type: string
  created: string
  updated: string
  rir: string
  whois: string
}

interface Datacenter {
  datacenter: string
  network: string
  country: string
  city: string
}

interface Company {
  name: string
  domain: string
  type: string
  network: string
}

export interface Ip123_Risk {
  code: number
  data: {
    risk: string
    risk_english?: string
    score: number
  }
  msg: string
}

export type Risk_Info = {
  ip123: {
    risk: string
    score: number | string
  }
  scamalytics: {
    risk: string
    score: number | string
  }
}

export type Scamalytics_Risk = {
  status: string
  mode: string
  ip: string
  score: number
  risk: string
  url: string
  exec: string
  credits: {
    used: number
    remaining: number
    last_sync_timestamp_utc: string
    seconds_elapsed_since_last_sync: number
    note: string
  }
}
