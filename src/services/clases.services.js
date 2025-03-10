import network from '../plugins/axiosInstance'

const getListClases = async (params) => await network.get('/api/v1/catalogos/clases', { disableLoader: true, params })
const postClase = async (body) => await network.post('/api/v1/catalogos/clases/crear', body)
const putClase = async (id_clase, body) => await network.put(`/api/v1/catalogos/clases/actualizar/${id_clase}`, body)
const patchClase = async (id_clase, body) => await network.patch(`/api/v1/catalogos/clases/cambiar-estado/${id_clase}`, body)

export default {
    getListClases,
    postClase,
    putClase,
    patchClase,
}
