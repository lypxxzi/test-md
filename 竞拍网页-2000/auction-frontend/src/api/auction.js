import request from './request'

export const verifyPassword = (password) => {
  return request.post('/auction/verify-password', { password })
}

export const getAuctionList = () => {
  return request.get('/auction/list')
}

export const placeBid = (data) => {
  return request.post('/auction/bid', data)
}

export const getAuctionDetail = (id) => {
  return request.get(`/auction/detail/${id}`)
}
