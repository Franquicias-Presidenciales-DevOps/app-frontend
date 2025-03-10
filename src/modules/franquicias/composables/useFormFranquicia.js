// utils
import { ref, onMounted, watch, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { required, requiredIf, textfield, minlength, number, textarea } from "@/utils/validations";
import { VerifyRolesFn } from '@/utils/global_functions';
import { DateFormatFn } from '@/utils/global_functions';

// stores
import { useFrancqStore } from "../franquicias.store";
import { useUtilsStore } from "@/store/utils";

// services
import aduanas_services from "@/services/aduanas.services";
import instituciones_services from "@/services/instituciones.services";
import oficiales_services from '@/services/oficiales.services';
import facturas_services from '@/services/facturas.services';
import clases_services from '@/services/clases.services';
import franquicia_service from '@/services/franquicias.services';

export default function useFranquiciaForm() {
    // stores
    const store_ref = useFrancqStore();
    const utils_store = useUtilsStore();
    // utils
    const route = useRoute();
    const router = useRouter();
    // references
    const guia_aerea_ref = ref(null);
    const embarque_ref = ref(null);
    const mercaderia_ref = ref(null);
    const carta_porte_ref = ref(null);
    const dmti_ref = ref(null);
    const institucion_ref = ref(null);
    // variables
    const ctl_aduanas = ref([]);
    const ctl_instituciones = ref([]);
    const ctl_oficiales = ref([]);
    const ctl_facturas = ref([]);
    const ctl_clases = ref([]);
    const ctl_entidades = ref([]);
    // -> validaciones de campos
    const invalid = reactive({
        institucion_autocomplete: false,
        guia_aerea_textfield: false,
        embarque_textfield: false,
        mercaderia_textfield: false,
        carta_porte_textfield: false,
        dmti_textfield: false,
    });
    // -> modal
    const view_mode = ref(true);
    const show_alert = ref(false);
    const title_identify = ref('¡Identificador ya existente!')
    const subtitle_identify = ref('')

    // validaciones
    // const regex = /^[A-Za-zñÑáéíóúÁÉÍÓÚüÜ0-9 ,?!.¡¿*+-_@#$%]*$/; // deprecated
    const reg_n_factura = /^[A-Za-zñÑáéíóúÁÉÍÓÚüÜ°0-9 ,?!.¡¿*+-_@#$%]*$/;
    const RULES_CONST = {
        entidad: [required], // select
        institucion: [(value) => requiredIf(value, null, store_ref.entidad === 1)], // select
        oficial: [(value) => requiredIf(value, null, store_ref.entidad === 2)], // select
        aduana: [required], // select
        guia_aerea: [(value) => textfield(value, null, reg_n_factura), (value) => minlength(value, null, 4)],
        embarque: [(value) => textfield(value, null, reg_n_factura), (value) => minlength(value, null, 4)],
        mercaderia: [(value) => textfield(value, null, reg_n_factura), (value) => minlength(value, null, 4)],
        carta_porte: [(value) => textfield(value, null, reg_n_factura), (value) => minlength(value, null, 4)],
        dmti: [(value) => textfield(value, null, reg_n_factura), (value) => minlength(value, null, 4)],
        duca: [(value) => textfield(value, null, reg_n_factura), (value) => minlength(value, null, 4)],
        tipo_factura: [required], // select
        cantidad_bultos: [required, number], // (value) => greaterThan(value, null, 0)
        clase: [required], // select
        n_factura: [(value) => textfield(value, null, reg_n_factura), (value) => minlength(value, null, 4)],
        contenido: [required, textarea, (value) => minlength(value, null, 4)],
        destino: [required, (value) => textfield(value, null, reg_n_factura), (value) => minlength(value, null, 4)],
        itinerario: [(value) => textfield(value, null, reg_n_factura), (value) => minlength(value, null, 4)],
        nota: [(value) => textfield(value, null, reg_n_factura), (value) => minlength(value, null, 4)],
        observacion: [textarea, (value) => minlength(value, null, 4)],
        fecha_franquicia: [required],
        fecha_reporte: [(value) => requiredIf(value, null, store_ref.franquicia?.estado == 6 || store_ref.franquicia?.estado == 7)],
        fecha_entrega: [(value) => requiredIf(value, null, store_ref.franquicia?.estado == 6 || store_ref.franquicia?.estado == 7)],
    };

    // regular functions {
    function ViewDatesFn() {
        if (!VerifyRolesFn('GESTIONAR_FECHAS')) return false

        if (store_ref.franquicia?.estado == 6 || store_ref.franquicia?.estado == 7) {
            return true;
        } else {
            return store_ref.franquicia?.fecha_entrega || store_ref.franquicia?.fecha_despacho
        }
    }
    /**
     * @param {Object} ref - Objeto de referencia del campo
     * @description Función para establecer las alertas para modal en base al nombre del campo
     * @return {Object} Objeto con el parámetro a enviar a backend y el titulo de la alerta
     */
    function FindNameFn(ref) {
        let result = {}

        if (route.params?.id) result.franquicia_id = route.params.id;

        switch (ref.name) {
            case 'guia_aerea_textfield':
                result.guia_aerea = ref.modelValue;
                title_identify.value = '¡Guía aérea ya existente!'
                break;
            case 'embarque_textfield':
                result.conocimiento_embarque = ref.modelValue;
                title_identify.value = '¡Conocimiento de embarque ya existente!'
                break;
            case 'mercaderia_textfield':
                result.mercaderia_no = ref.modelValue;
                title_identify.value = '¡Información de mercaderías recibidas repetido!'
                break;
            case 'carta_porte_textfield':
                result.carta_porte = ref.modelValue;
                title_identify.value = '¡Carta de porte ya existente!'
                break;
            case 'dmti_textfield':
                result.dmti = ref.modelValue;
                title_identify.value = '¡DMTI ya existente!'
                break;
        }

        return result;
    }
    // }

    // async functions
    /** @description Función para obtener el catálogo de instituciones */
    async function FetchCtlInstitucionesFn() {
        const { data, status } = await instituciones_services.getListInstituciones({
            activo: 'active',
            per_page: -1
        });

        if (status === 200) {
            ctl_instituciones.value = data;
        }
    }
    /** @description Función para obtener el catálogo de oficiales */
    async function FetchCtlOficialFn() {
        const { data, status } = await oficiales_services.getListOficiales({
            activo: 'active',
            per_page: -1
        });

        if (status === 200) {
            ctl_oficiales.value = data;
        }
    }
    /** @description Función para obtener el catálogo de aduanas */
    async function FetchCtlAduanasFn() {
        const { data, status } = await aduanas_services.getListAduanas({
            activo: 'active',
            per_page: -1
        });

        if (status === 200) {
            ctl_aduanas.value = data;
        }
    }
    /** @description Función para obtener el catálogo de tipo de facturas */
    async function FetchCtlFacturaFn() {
        const { data, status } = await facturas_services.getListfacturas({
            activo: 'active',
            per_page: -1
        });

        if (status === 200) {
            ctl_facturas.value = data;
        }
    }
    /** @description Función para obtener el catálogo de clases */
    async function FetchCtlClasesFn() {
        const { data, status } = await clases_services.getListClases({
            activo: 'active',
            per_page: -1
        });

        if (status === 200) {
            ctl_clases.value = data;
        }
    }
    /** @description Función para obtener el catálogo de entidades */
    async function FetchCtlEntidadesFn() {
        const { data, status } = await franquicia_service.getListEntidades({
            // pagination: false
            activo: 'active',
            per_page: -1
        });

        if (status === 200) {
            ctl_entidades.value = data;
        }
    }
    /** @description Función para obtener la información de la franquicia (referencia a action del store) */
    async function FetchDataFranquiciaFn() {
        if (route?.name == 'crearFranquicia') {
            store_ref.load_form = false;
            return;
        }

        await store_ref.FetchDataFranquiciaAct(route.params.id)

        if (route?.name == 'editarFranquicia') {
            if (store_ref.franquicia?.estado == 2 || store_ref.franquicia?.estado == 4 || store_ref.franquicia?.estado == 5 || store_ref.franquicia?.estado == 6 || store_ref.franquicia?.estado == 7) {
                router.push({ name: 'listFranquicias' }).then(() => {
                    utils_store.setNotification({
                        type: 'warning',
                        message: 'La acción solicitada no es permitida',
                        timeout: 3000,
                    });
                })
            }
        }
    }

    /**
     * @param {Object} ref - Objeto de referencia del campo
     * @description Función para buscar si el valor ingresado en el campo ya existe en la base de datos
     */
    async function SearchValueFn(ref) {

        if (view_mode.value) return;

        if (ref.modelValue == null || ref.modelValue == '') return;

        const errors = await ref.validate()

        if (errors.length > 0) return

        const payload = FindNameFn(ref)

        const { data, status } = await franquicia_service.getFranquiciaByValue({ params: payload });

        if (status === 200) {
            if (data.length > 0) {
                invalid[ref.name] = true;
                show_alert.value = true;
                subtitle_identify.value = `Código de franquicia: ${data[0]?.codigo_franquicia ?? data[0]?.codigo_provisional}`
            }
        }
    }

    async function VerifyJuridicoFn() {
        invalid.institucion_autocomplete = false;

        if (view_mode.value) return;

        if (!store_ref?.institucion?.id) return;

        const { data, status } = await franquicia_service.getValidInstitucion(store_ref?.institucion?.id);

        if (status === 200) {
            if (data.message) {
                invalid.institucion_autocomplete = true;
                show_alert.value = true;
                title_identify.value = data.message;
                subtitle_identify.value = 'Fecha de vencimiento: ' + DateFormatFn(data.expired_date);
            }
        }
    }

    // watches
    watch(route, (value) => {
        if (value) {
            FetchDataFranquiciaFn()
            if (route?.name == 'crearFranquicia' || route?.name == 'editarFranquicia') {
                view_mode.value = false;
            } else {
                view_mode.value = true;
            }
        }
    })

    watch(() => store_ref.institucion, (value) => {
        if (value?.nombre) {
            VerifyJuridicoFn()
        } else {
            invalid.institucion_autocomplete = false;
        }
    });

    // hooks
    onMounted(() => {
        if (route?.name == 'crearFranquicia' || route?.name == 'editarFranquicia') {
            view_mode.value = false;
        }

        Promise.all([
            utils_store.loader_st = true,
            FetchCtlEntidadesFn(),
            FetchCtlInstitucionesFn(),
            FetchCtlOficialFn(),
            FetchCtlAduanasFn(),
            FetchCtlFacturaFn(),
            FetchCtlClasesFn(),
        ]).then(() => {
            utils_store.loader_st = false;
            FetchDataFranquiciaFn()
        })
    })

    return {
        carta_porte_ref,
        ctl_aduanas,
        ctl_clases,
        ctl_entidades,
        ctl_facturas,
        ctl_instituciones,
        ctl_oficiales,
        dmti_ref,
        embarque_ref,
        guia_aerea_ref,
        invalid,
        mercaderia_ref,
        RULES_CONST,
        SearchValueFn,
        show_alert,
        store_ref,
        title_identify,
        view_mode,
        ViewDatesFn,
        VerifyJuridicoFn,
        subtitle_identify,
        institucion_ref,
    }
}