import network from "../plugins/axiosInstance";

const getListRoles = async (params) =>
  await network.get("/api/v1/roles", { disableLoader: true, params });
const createRole = async (body) =>
  await network.post("/api/v1/roles/crear", body);
const changeRolStatus = async (id, body) => await network.patch(`/api/v1/roles/cambiar-estado/${id}`, body)
const updateRole = async (id, body) => await network.put(`/api/v1/roles/actualizar/${id}`, body)

export default {
  getListRoles,
  createRole,
  changeRolStatus,
  updateRole

};
