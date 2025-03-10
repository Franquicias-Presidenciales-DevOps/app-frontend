import network from '../plugins/axiosInstance'

const getListEntidades = async (params = {}) => await network.get('/api/v1/catalogos/entidad', { disableLoader: true, params })
const getListEstados = async (params = {}) => await network.get('/api/v1/catalogos/estado', { disableLoader: true, params })

const getListFranquicias = async (body) => await network.get('/api/v1/franquicias', body)
const geFranquiciaById = async (id_franquicia, params) => await network.get(`/api/v1/franquicias/ver-detalle/${id_franquicia}`, { disableLoader: true, params })
const getFranquiciaByValue = async (params) => await network.get(`/api/v1/franquicias/validar-unicidad`, { ...params })
const getValidInstitucion = async (id_institucion, params) => await network.get(`/api/v1/franquicias/institucion/verificar-expiracion/${id_institucion}`, { ...params })

// save
const postBorrador = async (params) => await network.post('/api/v1/franquicias/borrador', { ...params })
const putBorrador = async (id_franquicia, params) => await network.put(`/api/v1/franquicias/borrador-update/${id_franquicia}`, { ...params })

// send
const postFranquicia = async (params) => await network.post('/api/v1/franquicias/crear', { ...params })
const putFranquicia = async (id_franquicia, params) => await network.put(`/api/v1/franquicias/crear/${id_franquicia}`, { ...params })

// resolve
const putResolveFranq = async (id_franquicia, params) => await network.put(`/api/v1/franquicias/solventar/${id_franquicia}`, { ...params })

// approve
const putApproveFranq = async (id_franquicia, params) => await network.put(`/api/v1/franquicias/aprobar/${id_franquicia}`, { ...params })

// anulate
const putAnulateFranq = async (id_franquicia, params) => await network.patch(`/api/v1/franquicias/anular/${id_franquicia}`, { ...params })

// observe
const putObserveFranq = async (id_franquicia, params) => await network.patch(`/api/v1/franquicias/observar/${id_franquicia}`, { ...params })

// firmas
const putActualizarFechas = async (id_franquicia, params) => await network.patch(`/api/v1/franquicias/actualizar-fechas/${id_franquicia}`, { ...params })
const putFirmar = async (id_franquicia, params) => await network.put(`/api/v1/franquicias/firmar/${id_franquicia}`, { ...params })

// files
const postFiles = async (params) => await network.post(`/api/v1/franquicias/subir-archivo`, params, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
})
const getFilesByFranq = async (id_franquicia, params) =>
    await network.get(`/api/v1/franquicias/ver-archivos-franquicia/${id_franquicia}`, { params });

const getInfoFile = async (id_archivo, params) =>
    await network.get(`/api/v1/franquicias/ver-archivo/${id_archivo}`, { params });

const deleteFile = async (id_archivo, params) =>
    await network.patch(`/api/v1/franquicias/eliminar-archivo/${id_archivo}`, { params });

// clasificacion
const getRateFranquicia = async (id_franquicia, params) => await network.get(`/api/v1/clasificacion/obtener-puntaje/${id_franquicia}`, { params });
const postRateFranquicia = async (params) => await network.post('/api/v1/clasificacion/subir-puntaje', { ...params });
const getGlobalRateFranquicia = async (id_franquicia, params) => await network.get(`/api/v1/clasificacion/obtener-promedio-entidad/${id_franquicia}`, { params });

// observaciones en clasificacion
const postObsRate = async (params) => await network.post('/api/v1/clasificacion/guardar-observacion', params, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});
const getListObsRate = async (id_file, params) => await network.get(`/api/v1/clasificacion/ver-observaciones/${id_file}`, { params });
const getFileObsRate = async (id_franquicia, params) => await network.get(`/api/v1/clasificacion/ver-archivo-observacion/${id_franquicia}`, { params });
const deleteObsRate = async (id_obs, params) => await network.delete(`/api/v1/clasificacion/eliminar-observacion/${id_obs}`, { ...params });

export default {
    deleteFile,
    geFranquiciaById,
    getFilesByFranq,
    getFranquiciaByValue,
    getGlobalRateFranquicia,
    getInfoFile,
    getListEntidades,
    getListEstados,
    getListFranquicias,
    getRateFranquicia,
    getValidInstitucion,
    postBorrador,
    postFiles,
    postFranquicia,
    postRateFranquicia,
    putActualizarFechas,
    putAnulateFranq,
    putApproveFranq,
    putBorrador,
    putFirmar,
    putFranquicia,
    putObserveFranq,
    putResolveFranq,
    postObsRate,
    getListObsRate,
    getFileObsRate,
    deleteObsRate
}