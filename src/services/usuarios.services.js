import network from "../plugins/axiosInstance";

const getListUsuarios = async (params) =>
  await network.get("/api/v1/usuarios", { disableLoader: true, params });
const postUsuario = async (body) =>
  await network.post("/api/v1/usuarios/crear", body);
const putUsuario = async (id, body) =>
  await network.put(`/api/v1/usuarios/actualizar/${id}`, body);
const patchUsuario = async (id, body) =>
  await network.patch(`/api/v1/usuarios/cambiar-estado/${id}`, body);
const unblockedUsuario = async (id, body) =>
  await network.put(`/api/v1/usuarios/desbloquear-usuario/${id}`, body);
export default {
  getListUsuarios,
  postUsuario,
  putUsuario,
  patchUsuario,
  unblockedUsuario,
};
