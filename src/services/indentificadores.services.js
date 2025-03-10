import network from '../plugins/axiosInstance'

const getListIdentificadores = async (params) => await network.get('/api/v1/catalogos/identificador-gestion', { disableLoader: true, params })
const postIdentificador = async (body) => await network.post('/api/v1/catalogos/identificador-gestion/crear', body)
const putIdentificador = async (id_identificador, body) => await network.put(`/api/v1/catalogos/identificador-gestion/actualizar/${id_identificador}`, body)

export default {
    getListIdentificadores,
    postIdentificador,
    putIdentificador,
}