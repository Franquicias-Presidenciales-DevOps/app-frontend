/**
 * @typedef {Object} Paginate
 * @property {number} page - The current page number.
 * @property {number} perPage - The number of items per page.
 */

// utils
import { ref, reactive, onMounted } from 'vue'
import { useUtilsStore } from '@/store/utils'
import { required, textfield, minlength } from '@/utils/validations'
import { useRouter } from 'vue-router'
import { VerifyRolesFn } from '@/utils/global_functions'

// services
import aduanas_services from '@/services/aduanas.services'
import facturas_services from '@/services/facturas.services'
import franquicia_service from '@/services/franquicias.services'

/**
 * @param {Number} id_estado
 * @description Retorna el color del body de la tabla
 * @returns {String}
 */
export function GetBodyColorFn(id_estado) {
    switch (id_estado) {
        case 1:
            return 'grey'
        case 8:
        case 4:
        case 2:
            return 'blue-lighten-4'
        case 3:
            return 'yellow-lighten-4'
        case 5:
            return 'red-lighten-4'
        case 6:
            return 'green-lighten-4'
        case 7:
            return 'green-accent-3'
        default:
            return null
    }
}

/**
 * @param {Number} id_estado
 * @description Retorna el color del texto de la tabla
 * @returns {String}
 */
export function GetClassColorFn(id_estado) {
    switch (id_estado) {
        case 1:
            return 'text-grey-darken-3'
        case 8:
        case 4:
        case 2:
            return 'text-blue-darken-3'
        case 3:
            return 'text-yellow-darken-3'
        case 5:
            return 'text-red-darken-3'
        case 6:
            return 'text-green-darken-3'
        case 7:
            return 'green-accent-4'
        default:
            return null
    }
}

export function useListFranquicia() {
    // references
    const utils_store = useUtilsStore()
    const router = useRouter()
    const table = ref(null)
    const form = ref(null)

    // listado
    const per_page_var = ref(10)
    const list_franquicias_var = ref([])
    const total_franquicias_var = ref(0)
    const loading_var = ref(false)

    const filters = reactive({
        search: null,
        temp_search: null,
        fecha_inicio: null,
        fecha_fin: null,
        status: null,
        entidad: null,
        aduana: null,
        n_orden: null,
        n_guia: null,
        embarque: null,
        mercaderia: null,
        carta_porte: null,
        nota_pedido: null,
        tipo_factura: null
    })

    const ctl_filters = [
        { name: 'Aduana', value: 1 },
        // { name: 'No. Orden', value: 2 },
        { name: 'No. Guía aérea', value: 3 },
        { name: 'Conoc. de embarque no.', value: 4 },
        { name: 'Inf. de mercaderías rec. no.', value: 5 },
        { name: 'Carta de porte no.', value: 6 },
        { name: 'Nota de pedido no.', value: 7 },
        { name: 'Tipo de franquicia', value: 8 }
    ]

    const filters_selected = ref([])
    const ctl_status = ref([])
    const ctl_aduanas = ref([])
    const ctl_facturas = ref([])
    const ctl_entidades = ref([])

    const regex = /^[A-Za-zñÑáéíóúÁÉÍÓÚüÜ0-9 ,?!.¡¿*+-_@#$%]*$/

    const RULES_CONST = {
        temp_search: [
            value => textfield(value, null, regex),
            value => minlength(value, null, 4)
        ],
        n_orden: [
            value => textfield(value, null, regex),
            value => minlength(value, null, 4)
        ],
        n_guia: [
            value => textfield(value, null, regex),
            value => minlength(value, null, 4)
        ],
        embarque: [
            value => textfield(value, null, regex),
            value => minlength(value, null, 4)
        ],
        mercaderia: [
            value => textfield(value, null, regex),
            value => minlength(value, null, 4)
        ],
        carta_porte: [
            value => textfield(value, null, regex),
            value => minlength(value, null, 4)
        ],
        nota_pedido: [
            value => textfield(value, null, regex),
            value => minlength(value, null, 4)
        ]
    }

    const HEADERS_CONST = [
        { title: 'Código provisional', key: 'codigo_provisional', sortable: false },
        {
            title: 'Código de franquicia',
            key: 'codigo_franquicia',
            sortable: false
        },
        { title: 'Aduana', key: 'aduana.nombre', sortable: false },
        { title: 'Entidad', key: 'entidad', sortable: false },
        { title: 'Fecha de creación', key: 'fecha_creacion', sortable: false },
        { title: 'Estado', key: 'status', sortable: false, align: 'center' },
        { title: 'Acciones', key: 'actions', sortable: false }
    ]

    // regular functions
    /**
     * @param {Number} value
     * @description Función para verificar si el valor se encuentra en el array de filtros seleccionados
     */
    function ContainValueFn(value) {
        return filters_selected.value.includes(value)
    }

    /**
     * @param {Object} item
     * @description Función para redireccionar a la vista de franquicia en base al estado de la franquicia
     */
    function HandlerVisualizarFn(item) {
        let routeName = 'verFranquicia'

        if (item.estados.id == 1 && VerifyRolesFn('ACTUALIZAR_FRANQUICIA')) {
            routeName = 'editarFranquicia'
        }

        if (item.estados.id == 3 && VerifyRolesFn('ACTUALIZAR_OBSERVACION_FRANQUICIA')) {
            routeName = 'editarFranquicia'
        }

        // if (item.estados.id == 6 && VerifyRolesFn('GESTIONAR_FECHAS')) {
        //     routeName = 'editarFranquicia'
        // }

        router.push({
            name: routeName,
            params: { id: item.id }
        })
    }

    function GetActionsFn(item) {
        switch (item.estados.id) {
            case 1:
                return VerifyRolesFn('ACTUALIZAR_FRANQUICIA')
                    ? ' mdi-pencil-outline'
                    : ' mdi-eye-outline'
            case 3:
                return VerifyRolesFn('ACTUALIZAR_OBSERVACION_FRANQUICIA')
                    ? ' mdi-pencil-outline'
                    : ' mdi-eye-outline'
            case 6:
                return VerifyRolesFn('GESTIONAR_FECHAS')
                    ? ' mdi-pencil-outline'
                    : ' mdi-eye-outline'
            default:
                return 'mdi-eye-outline'
        }
    }

    function ShowActionFn(item) {
        const roles = {
            1: 'ACTUALIZAR_FRANQUICIA',
            3: 'ACTUALIZAR_OBSERVACION_FRANQUICIA',
            6: 'GESTIONAR_FECHAS',
        };

        return VerifyRolesFn(roles[item.estados.id]) || VerifyRolesFn('VER_DETALLE_FRANQUICIA');
    }

    function GetTextActionsFn(item) {
        switch (item.estados.id) {
            case 1:
                return VerifyRolesFn('ACTUALIZAR_FRANQUICIA') ? 'Editar' : ' Visualizar'
            case 3:
                return VerifyRolesFn('ACTUALIZAR_OBSERVACION_FRANQUICIA')
                    ? 'Editar'
                    : ' Visualizar'
            case 6:
                return VerifyRolesFn('GESTIONAR_FECHAS') ? ' Editar' : ' Visualizar'
            default:
                return 'Visualizar'
        }
    }

    function CleanFiltersFn() {
        // verificar si el objeto filters posee todas las propiedades en null
        if (!Object.values(filters).some(value => value !== null)) return

        filters.search = null
        filters.temp_search = null
        filters.fecha_inicio = null
        filters.fecha_fin = null
        filters.status = null
        filters.entidad = null
        filters.aduana = null
        filters.n_orden = null
        filters.n_guia = null
        filters.embarque = null
        filters.mercaderia = null
        filters.carta_porte = null
        filters.nota_pedido = null
        filters.tipo_factura = null

        filters_selected.value = []
    }

    async function SearchValueFn() {
        if (!Object.values(filters).some(value => value !== null)) return

        const { valid } = await form.value.validate()

        if (!valid) return

        filters.search = String(Date.now())
    }

    // async functions
    /**
     * @param {Paginate} paginate - The pagination details.
     * @description Función para obtener el listado de franquicias
     */
    async function FetchListFranquiciasFn({ page, itemsPerPage }) {
        const { data, status, headers } =
            await franquicia_service.getListFranquicias({
                disableLoader: true,
                params: {
                    page,
                    per_page: itemsPerPage,
                    // filters
                    guia_aerea: filters.n_guia,
                    carta_porte: filters.carta_porte,
                    conocimiento_embarque: filters.embarque,
                    mercaderia_no: filters.mercaderia,
                    dmti: filters.nota_pedido,
                    estado: filters.status,
                    entidad: filters.entidad,
                    factura: filters.tipo_factura,
                    aduana: filters.aduana,
                    buscar: filters.temp_search,
                    fecha_inicio: filters.fecha_inicio,
                    fecha_fin: filters.fecha_fin
                }
            })

        if (status === 200) {
            list_franquicias_var.value = data
            total_franquicias_var.value = headers['total_rows']
        }
    }

    /** @description Función para obtener el catálogo de estados */
    async function FetchCtlStatusFn() {
        const { data, status } = await franquicia_service.getListEstados({
            activo: 'active'
        })

        if (status === 200) ctl_status.value = data
    }

    /** @description Función para obtener el catálogo de entidades */
    async function FetchCtlEntidadesFn() {
        const { data, status } = await franquicia_service.getListEntidades({
            activo: 'active'
        })

        if (status === 200) ctl_entidades.value = data
    }

    /** @description Función para obtener el catálogo de aduanas */
    async function FetchCtlAduanasFn() {
        const { data, status } = await aduanas_services.getListAduanas({
            activo: 'active',
            per_page: -1
        })

        if (status === 200) ctl_aduanas.value = data
    }

    /** @description Función para obtener el catálogo de tipo de facturas */
    async function FetchCtlFacturaFn() {
        const { data, status } = await facturas_services.getListfacturas({
            activo: 'active',
            per_page: -1
        })

        if (status === 200) ctl_facturas.value = data
    }

    // hooks
    onMounted(() => {
        utils_store.loader_st = true

        Promise.all([
            FetchCtlStatusFn(),
            FetchCtlAduanasFn(),
            FetchCtlFacturaFn(),
            FetchCtlEntidadesFn()
        ]).finally(() => (utils_store.loader_st = false))
    })

    return {
        per_page_var,
        list_franquicias_var,
        total_franquicias_var,
        loading_var,

        filters,
        filters_selected,

        HEADERS_CONST,
        RULES_CONST,
        ctl_filters,
        ctl_status,
        ctl_aduanas,
        ctl_facturas,
        ctl_entidades,

        ContainValueFn,
        GetBodyColorFn,
        GetClassColorFn,
        HandlerVisualizarFn,
        FetchListFranquiciasFn,
        GetActionsFn,
        GetTextActionsFn,
        CleanFiltersFn,
        table,
        form,
        SearchValueFn,
        ShowActionFn
    }
}
