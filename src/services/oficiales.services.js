import network from '../plugins/axiosInstance'

const getListOficiales = async (params) => await network.get('/api/v1/catalogos/oficial', { disableLoader: true, params })
const postOficial = async (body) => await network.post('/api/v1/catalogos/oficial/crear', body)
const putOficial = async (id_oficial, body) => await network.put(`/api/v1/catalogos/oficial/actualizar/${id_oficial}`, body)
const patchOficial = async (id_oficial, body) => await network.patch(`/api/v1/catalogos/oficial/cambiar-estado/${id_oficial}`, body)

export default {
    getListOficiales,
    postOficial,
    putOficial,
    patchOficial,
}
