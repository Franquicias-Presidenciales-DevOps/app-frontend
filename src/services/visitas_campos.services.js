import network from '../plugins/axiosInstance'

const getListSegGen = async (params = {}) => await network.get('/api/v1/franquicias/visitas-campos', { disableLoader: true, params })
const getListSegFranq = async (params = {}) => await network.get('/api/v1/franquicias/visitas-campos/seguimiento', { disableLoader: true, params })
const getCategoriasVisita = async (params = {}) => await network.get('/api/v1/catalogos/categoria-visita', { disableLoader: true, params })
const getFiltroEntidades = async (params = {}) => await network.get('/api/v1/catalogos/filtro-visita/entidad', { disableLoader: true, params })
const getFiltroFranquicias = async (params = {}) => await network.get(`/api/v1/catalogos/filtro-visita/entidad/codigos-franquicias`, { disableLoader: true, params })
const getFiltroSeguimientos = async (params = {}) => await network.get('/api/v1/catalogos/filtro-visita/entidad/seguimiento', { disableLoader: true, params })
const createVisitaCampo = async (data) => await network.post('/api/v1/franquicias/visitas-campos', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
const getReporteById = async (id_visita_campo, params) => await network.get(`/api/v1/franquicias/visitas-campos/generar-reporte/${id_visita_campo}`, { disableLoader: false, params, responseType: "blob" })
const deleteVistCamp = async (id_visita_campo) => await network.delete(`/api/v1/franquicias/visitas-campos/${id_visita_campo}`)
const getVisitaCampo = async (id) => await network.get(`/api/v1/franquicias/visitas-campos/detalle-visita/${id}`, { disableLoader: false })
const updateVisitaCampo = async (id, data) => await network.post(`/api/v1/franquicias/visitas-campos/${id}`, data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
const getDetallesSeguimiento = async (id) => await network.get(`/api/v1/franquicias/visitas-campos/detalle-seguimiento/${id}`, { disableLoader: true })
const generarReportesFranquicia = async (id_franquicia, params) => await network.get(`/api/v1/franquicias/visitas-campos/generar-reportes-franquicia/${id_franquicia}`, { disableLoader: false, params, responseType: "blob" })

export default {
  getListSegGen,
  getListSegFranq,
  getCategoriasVisita,
  getFiltroEntidades,
  getFiltroFranquicias,
  getFiltroSeguimientos,
  createVisitaCampo,
  getReporteById,
  deleteVistCamp,
  getVisitaCampo,
  updateVisitaCampo,
  getDetallesSeguimiento,
  generarReportesFranquicia,
}
