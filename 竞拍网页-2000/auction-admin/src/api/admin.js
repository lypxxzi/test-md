import request from './request'

export const login = (data) => {
  return request.post('/admin/login', data)
}

export const logout = () => {
  return request.post('/admin/logout')
}

export const getAuctionList = (params) => {
  return request.get('/admin/auction/list', { params })
}

export const addAuction = (data) => {
  return request.post('/admin/auction/add', data)
}

export const updateAuction = (data) => {
  return request.put('/admin/auction/update', data)
}

export const deleteAuction = (id) => {
  return request.delete(`/admin/auction/delete/${id}`)
}

export const updateAuctionStatus = (id, status) => {
  return request.put(`/admin/auction/status/${id}`, null, { params: { status } })
}

export const getUserList = (params) => {
  return request.get('/admin/user/list', { params })
}

export const getUserDetail = (id) => {
  return request.get(`/admin/user/detail/${id}`)
}

export const updateUserStatus = (params) => {
  return request.put('/admin/user/status', null, { params })
}

export const deleteUser = (id) => {
  return request.delete(`/admin/user/delete/${id}`)
}

export const getBidRecordList = (params) => {
  return request.get('/admin/bid/list', { params })
}

export const getBidTimeline = (auctionItemId) => {
  return request.get('/admin/bid/list', { params: { auctionItemId, pageNum: 1, pageSize: 500 } })
}

export const getUserBidTimeline = (userId) => {
  return request.get('/admin/bid/list', { params: { userId, pageNum: 1, pageSize: 500 } })
}

export const getStatistics = () => {
  return request.get('/admin/bid/statistics')
}

export const getConfigList = () => {
  return request.get('/admin/config/list')
}

export const updateConfig = (data) => {
  return request.put('/admin/config/update', data)
}
