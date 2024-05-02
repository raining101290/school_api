import { BASE_URL } from '../../page/global'
import { fetchData, patchData, postData } from '../commonAxiosFunctions'

export const getPackagePrice = (params) => {
  const url = `${BASE_URL}/getPackagePrice`
  return fetchData(url, params)
}

export const getToken = (params) => {
  const url = `${BASE_URL}/getToken`
  return fetchData(url, params)
}

export const getRefreshToken = (params) => {
  const url = `${BASE_URL}/getRefreshToken`
  return fetchData(url, params)
}

export const createPayment = (data) => {
  return postData(`${BASE_URL}/createPayment`, data)
}

export const executePayment = (data) => {
  return postData(`${BASE_URL}/executePayment`, data)
}

export const checkPaymentStatus = (params) => {
  const url = `${BASE_URL}/checkUserPayment`
  return fetchData(url, params)
}

export const checkPaymentOld = (params) => {
  const url = `${BASE_URL}/getDatacheckpayment/` + params
  return fetchData(url)
}

export const updateChannel = (data, id) => {
  return patchData(`${BASE_URL}/channels/${id}`, data)
}
