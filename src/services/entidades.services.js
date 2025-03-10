import network from "../plugins/axiosInstance";

const getEntidades = async (params) => await network.get('/api/v1/catalogos/entidad', { disableLoader: true, params })

export default {
  getEntidades,
};
