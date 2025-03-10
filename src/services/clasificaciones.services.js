import network from "../plugins/axiosInstance";

const getPromedioEntidades = async (params) => await network.get('/api/v1/clasificacion/obtener-promedio-entidades', { disableLoader: true, params })
const listarClasificaciones = async (params) => await network.get('/api/v1/catalogos/clasificaciones/listar-clasificaciones', { disableLoader: true, params })

export default {
    getPromedioEntidades,
    listarClasificaciones
};
