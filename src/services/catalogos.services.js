
import { addData, fetchDataFromStore, openDatabase } from '@/plugins/indexedDB'
import network from '../plugins/axiosInstance'

const getListDepartamentos = async (params) => {
    const db_name = await openDatabase('catalogos')

    const local_ctl_dept = await fetchDataFromStore(db_name, 'departamentos')

    if (local_ctl_dept.length > 0) {
        return { data: local_ctl_dept, status: 200 }
    } else {
        const api_dtl_dept = await network.get('/api/v1/catalogos/departamentos', { disableLoader: true, params })
        await addData(db_name, 'departamentos', api_dtl_dept.data)
        return api_dtl_dept
    }

}
const getListMunicipios = async (params) => {
    const db_name = await openDatabase('catalogos')

    const local_ctl_mncp = await fetchDataFromStore(db_name, 'municipios')

    if (local_ctl_mncp.length > 0) {
        return { data: local_ctl_mncp, status: 200 }
    } else {
        const api_ctl_mncp = await network.get('/api/v1/catalogos/municipios', { disableLoader: true, params })
        await addData(db_name, 'municipios', api_ctl_mncp.data)
        return api_ctl_mncp
    }
}

const getListDistritos = async (params) => {
    const db_name = await openDatabase('catalogos')

    const local_ctl_dstr = await fetchDataFromStore(db_name, 'distritos')

    if (local_ctl_dstr.length > 0) {
        return { data: local_ctl_dstr, status: 200 }
    } else {
        const api_ctl_dstr = await network.get('/api/v1/catalogos/distritos', { disableLoader: true, params })
        await addData(db_name, 'distritos', api_ctl_dstr.data)
        return api_ctl_dstr
    }
}

const getListRoles = async (params) => await network.get('/api/v1/roles/listar-select', { disableLoader: true, params })

export default {
    getListDepartamentos,
    getListMunicipios,
    getListDistritos,
    getListRoles
}
