import network from '../plugins/axiosInstance'

const getListFirmas = async (params) => await network.get('/api/v1/catalogos/firmante', { disableLoader: true, params })
const postFirma = async (body) => await network.post('/api/v1/catalogos/firmante/crear', body)
const putFirma = async (id_firma, body) => await network.put(`/api/v1/catalogos/firmante/actualizar/${id_firma}`, body)

export default {
    getListFirmas,
    postFirma,
    putFirma,
}
