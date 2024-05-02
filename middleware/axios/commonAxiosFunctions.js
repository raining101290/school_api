import axiosInstance from './axiosInterceptor'
import FormData from 'form-data'
export async function fetchData(url, params, rest) {
  const response = await axiosInstance.get(url, {
    params,
    ...rest
  })
  return response
}

export async function postData(url, body) {
  const response = await axiosInstance.post(url, {
    ...body
  })
  return response
}

export async function patchData(url, body) {
  const response = await axiosInstance.patch(url, {
    ...body
  })
  return response
}

export async function putData(url, body) {
  const response = await axiosInstance.put(url, {
    ...body
  })
  return response
}

export async function uploadData(url, file) {
  let formData = new FormData()

  formData.append('file', file)

  const response = await axiosInstance.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response
}

export async function deleteData(url) {
  const response = await axiosInstance.delete(url)
  return response
}
export async function postDataV2(url, body) {
  const response = await axiosInstance.post(url, JSON.stringify(body))
  return response
}
