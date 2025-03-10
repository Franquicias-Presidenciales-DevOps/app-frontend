import network from '../plugins/axiosInstance'

// const peticion = async(param, params = {}, disableLoader = false) => {
//   return await network.get(`/url/${param}`, { params }, { disableLoader })
// }

const login = async (email, password) => {
  return await network.post('/api/v1/login', { email, password })
}

const logout = async () => {
  return await network.post('/api/v1/logout')
}


const verify = async () => {
  return await network.get('/api/v1/verify-user')
}

const getAuthorizedPaths = async () => {
  return await network.get('/api/v1/get-rutas')
}


const changePassword = async (credentials) => {
  return await network.post('/api/v1/change-password', credentials)
}
const recuperarPassword = async (email) => {
  return await network.post('/api/v1/usuarios/recuperar-password', email)
}

export default {
  login,
  logout,
  getAuthorizedPaths,
  verify,
  changePassword,
  recuperarPassword,
}
