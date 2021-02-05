import settings from '@/settings'

let getProductNo = () => {
  let res = window.location.pathname.match(/PD\d*/)
  return res ? res[0] : ''
}

export function setToken(productNo, val) {
  if (!productNo) {return}
  let tokenStr = localStorage.getItem(settings.tokenKey)
  let token = tokenStr ? JSON.parse(tokenStr) : {}
  token[productNo] = val
  localStorage.setItem(settings.tokenKey, JSON.stringify(token))
}
export function getToken() {
  let productNo = getProductNo()
  if (!productNo) {return}
  let tokenStr = localStorage.getItem(settings.tokenKey)
  let token = tokenStr ? JSON.parse(tokenStr) : {}
  return token[productNo] || ''
}

export function setUser(productNo, val) {
  if (!productNo) {return}
  let userStr = localStorage.getItem(settings.userKey)
  let user = userStr ? JSON.parse(userStr) : {}
  user[productNo] = val
  localStorage.setItem(settings.userKey, JSON.stringify(user))
}
export function getUser() {
  let productNo = getProductNo()
  if (!productNo) {return}
  let userStr = localStorage.getItem(settings.userKey)
  let user = userStr ? JSON.parse(userStr) : {}
  return user[productNo] || {}
}

export default {
  setToken,
  getToken,
  setUser,
  getUser
}
