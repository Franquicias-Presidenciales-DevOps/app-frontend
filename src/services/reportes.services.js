import network from "../plugins/axiosInstance";

const getReportesById = async (id_franquicia, params) =>
    await network.get(`/api/v1/reportes/franquicias/${id_franquicia}`, { params, responseType: "blob" });

const getListReporteDiario = async (params) => await network.get('/api/v1/reportes', { disableLoader: true, params })
const getReportesDocumento = async (params) => await network.get('/api/v1/reportes/franquicias', { disableLoader: true, params,responseType: "blob" })


export default {
    getReportesById,
    getListReporteDiario,
    getReportesDocumento,
};
