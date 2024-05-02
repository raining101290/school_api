import axios from 'axios'
import {
  getToken
} from '../utils/functions'

const axiosInstance = axios.create()
axiosInstance.customHeader = {}
axiosInstance.setCustomHeader = function (headers) {
  axiosInstance.customHeader = { ...headers }
}
axiosInstance.interceptors.request.use(
  async (config) => {
    let token = getToken()
    config.headers = {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : null,
      ...axiosInstance.customHeader
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async function (error) {
    // TODO: Handle refresh token if 401 given
    const originalRequest = error.config
    if (error?.response?.status === 401 && !originalRequest._retry) {
      //
    } else {
      return Promise.reject(error)
    }
  }
)

export default axiosInstance
