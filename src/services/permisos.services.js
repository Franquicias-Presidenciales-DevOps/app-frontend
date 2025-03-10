import network from '../plugins/axiosInstance'

const getListPermisos = async () => await network.get('/api/v1/permisos', { disableLoader: true })
const getPermiso = async (id) => await network.get(`/api/v1/permisos/${id}`, { disableLoader: true })

export default {
  getListPermisos,
  getPermiso
}
