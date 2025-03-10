import network from '../plugins/axiosInstance'

const getListfacturas = async (params) => await network.get('/api/v1/catalogos/facturas', { disableLoader: true, params })
const postfactura = async (body) => await network.post('/api/v1/catalogos/facturas/crear', body)
const putfactura = async (id_factura, body) => await network.put(`/api/v1/catalogos/facturas/actualizar/${id_factura}`, body)
const patchfactura = async (id_factura, body) => await network.patch(`/api/v1/catalogos/facturas/cambiar-estado/${id_factura}`, body)

export default {
    getListfacturas,
    postfactura,
    putfactura,
    patchfactura,
}
