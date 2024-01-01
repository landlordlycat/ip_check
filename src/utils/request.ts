import axios from 'axios'

const request = axios.create({
  baseURL: 'https://api.ipapi.is'
})

const $axios = axios.create({
  baseURL: 'https://api.ipify.org'
})

request.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

$axios.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export { request, $axios }
