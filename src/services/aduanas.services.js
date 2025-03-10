import network from '../plugins/axiosInstance'

const getListAduanas = async (params = {}) => await network.get('/api/v1/catalogos/aduanas', { disableLoader: true, params })
const postAduana = async (body = {}) => await network.post('/api/v1/catalogos/aduanas/crear', { ...body })
const putAduana = async (id_aduana = null, body = {}) => await network.put(`/api/v1/catalogos/aduanas/actualizar/${id_aduana}`, { ...body })
// const deleteAduana = async (id_aduana) => await network.delete(`/api/v1/catalogos/aduanas/eliminar/${id_aduana}`)
const patchAduana = async (id_aduana = null, body = {}) => await network.patch(`/api/v1/catalogos/aduanas/cambiar-estado/${id_aduana}`, body)

export default {
    getListAduanas,
    postAduana,
    putAduana,
    // deleteAduana,
    patchAduana,
}
