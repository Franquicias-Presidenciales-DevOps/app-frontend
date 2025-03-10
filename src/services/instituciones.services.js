import network from '../plugins/axiosInstance'

const getListInstituciones = async (params) => await network.get('/api/v1/catalogos/institucion', { disableLoader: true, params })
const postInstitucion = async (body) => await network.post('/api/v1/catalogos/institucion/crear', body)
const putInstitucion = async (id_Institucion, body) => await network.put(`/api/v1/catalogos/institucion/actualizar/${id_Institucion}`, body)
const patchInstitucion = async (id_Institucion, body) => await network.patch(`/api/v1/catalogos/institucion/cambiar-estado/${id_Institucion}`, body)

export default {
    getListInstituciones,
    postInstitucion,
    putInstitucion,
    patchInstitucion,
}
