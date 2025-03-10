// utils
import { ref, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { required, textarea } from "@/utils/validations";
import { DateFormatFn } from "@/utils/global_functions";

// stores
import { useFrancqStore } from "../franquicias.store";
import { useUtilsStore } from "@/store/utils";
import { VerifyRolesFn } from "@/utils/global_functions";

// services
import franquicia_service from '@/services/franquicias.services';
import report_service from '@/services/reportes.services';

const store_ref = useFrancqStore();
const utils_store = useUtilsStore();

export default function useFranquicia() {
    // references
    const form_modal = ref(null);
    const form_comment_ref = ref(null);
    const router = useRouter();
    const route = useRoute();

    // variables
    const selected_tab = ref('one')
    const modal_alert = ref(false);
    const alert_no_content = ref(false);
    const modal_comment = ref(false);
    const title_modal_alert = ref('¿Estás seguro de realizar esta acción?');
    const message_modal_alert = ref('Una vez realizada la acción no se podrá deshacer');
    const action_modal_alert = ref('');
    const comment_modal = ref('');

    // constants
    const RULES_CONST = { comment_modal: [required, textarea] }

    // regular functions
    function ViewTabAdjuntosFn() {
        if (!VerifyRolesFn('LISTAR_ARCHIVOS_FRANQUICIA')) return false

        if (store_ref.franquicia?.estado == 6) {
            return true;
        } else {
            return store_ref.franquicia?.hasDocumentos
        }
    }

    function ViewTabRatingFn() {
        const estado = store_ref.franquicia?.estado;
        if ([2, 4].includes(estado)) return VerifyRolesFn('VER_PUNTAJE_FRANQUICIAS');
        if ([6, 7].includes(estado)) return VerifyRolesFn('PUNTUAR_FRANQUICIAS');
    }

    /**
     * @param {Object} obj1 - Objeto a comparar
     * @description Compara dos objetos y devuelve las diferencias entre ellos
     * @returns {Object} - Diferencias entre obj1 y obj2
     */
    function GetDifferencesFn(obj1) {

        const obj2 = {
            tipo: store_ref.franquicia.tipo,
            institucion_id: store_ref.franquicia.institucion_id || undefined,
            oficial_id: store_ref.franquicia.oficial_id || undefined,
            aduana_id: store_ref.franquicia.aduana_id,
            no_guia_aerea: store_ref.franquicia.no_guia_aerea,
            conoc_de_embarque_no: store_ref.franquicia.conoc_de_embarque_no,
            inf_de_mercaderias_rec_no: store_ref.franquicia.inf_de_mercaderias_rec_no,
            carta_de_porte_no: store_ref.franquicia.carta_de_porte_no,
            nota_de_pedido_no: store_ref.franquicia.nota_de_pedido_no,
            fecha: store_ref.franquicia.fecha,
            duca: store_ref.franquicia.duca,
            factura_comercial_id: store_ref.franquicia.factura_comercial_id,
            bultos: store_ref.franquicia.bultos,
            clase_id: store_ref.franquicia.clase_id,
            comentario: store_ref.franquicia.comentario,
            destino: store_ref.franquicia.destino,
            itinerario: store_ref.franquicia.itinerario,
            nota: store_ref.franquicia.nota,
            observacion: store_ref.franquicia.observacion
        }

        const differences = Object.keys(obj1).reduce((diff, key) => {
            if (obj1[key] !== obj2[key]) {
                diff[key] = obj1[key];
            }
            return diff;
        }, {});

        Object.keys(obj2).forEach(key => {
            if (!obj1.hasOwnProperty(key)) {
                differences[key] = obj1[key];
            }
        });

        return differences;
    }

    /**
     * @description Genera un objeto con los datos del formulario
     * @returns {Object} - Objeto con los datos del formulario
     */
    function GenerateFormFn() {
        return {
            tipo: store_ref.entidad,
            institucion_id: store_ref.institucion?.id || undefined,
            oficial_id: store_ref.oficial?.id || undefined,
            aduana_id: store_ref.aduana.id,
            no_guia_aerea: store_ref.guia_aerea,
            conoc_de_embarque_no: store_ref.embarque,
            inf_de_mercaderias_rec_no: store_ref.mercaderia,
            carta_de_porte_no: store_ref.carta_porte,
            nota_de_pedido_no: store_ref.dmti,
            fecha: store_ref.fecha_franquicia,
            duca: store_ref.duca,
            factura_comercial_id: store_ref.tipo_factura.id,
            bultos: store_ref.cantidad_bultos,
            clase_id: store_ref.clase.id,
            no_factura: store_ref.n_factura,
            comentario: store_ref.contenido,
            destino: store_ref.destino,
            itinerario: store_ref.itinerario,
            nota: store_ref.nota,
            observacion: store_ref.observacion,
        }
    }

    /** @description Función para manejar las acciones de los modales */
    function HandlerActionModalFn() {
        switch (action_modal_alert.value) {
            case 'send':
                SendFranquiciaFn();
                break;
            case 'resolve':
                ResolveFranquiciaFn();
                break;
            case 'approve':
                ApproveFranquiciaFn();
                break;
            case 'anulate':
                AnulateFranquiciaFn();
                break;
            case 'observe':
                ObserveFranquiciaFn();
                break;
            default:
                break;
        }
        modal_alert.value = false;
    }

    // async functions
    /**
     * @param {String} action - Acción a realizar
     * @description Función para abrir el modal de alerta
     */
    async function OpenModalAlertFn(action) {
        // await form_modal.value?.validate();
        // if (!form_modal.value.isValid) return;

        switch (action) {
            case 'send':
                await form_modal.value?.validate();
                if (!form_modal.value.isValid) return;
                modal_alert.value = true;
                action_modal_alert.value = 'send';
                title_modal_alert.value = 'Enviar franquicia';
                message_modal_alert.value = '¿Deseas enviar esta franquicia para aprobación de jefatura?';
                break;
            case 'resolve':
                await form_modal.value?.validate();
                if (!form_modal.value.isValid) return;
                modal_alert.value = true;
                action_modal_alert.value = 'resolve';
                title_modal_alert.value = 'Solventar observaciones';
                message_modal_alert.value = '¿Deseas enviar esta franquicia a jefatura para su aprobación?'
                break;
            case 'approve':
                modal_alert.value = true;
                action_modal_alert.value = 'approve';
                title_modal_alert.value = 'Aprobar franquicia';
                message_modal_alert.value = '¿Deseas confirmar la acción de aprobar esta franquicia?'
                break;
            case 'anulate':
                modal_comment.value = true;
                action_modal_alert.value = 'anulate';
                title_modal_alert.value = 'Anular franquicia';
                message_modal_alert.value = 'Justificación/motivo *';
                break;
            case 'observe':
                modal_comment.value = true;
                action_modal_alert.value = 'observe';
                title_modal_alert.value = 'Observar franquicia';
                message_modal_alert.value = 'Observaciones *';
                break;

            default:
                break;
        }
    }

    /** @description Función para guardar la franquicia como borrador */
    async function SaveBorradorFn() {

        await form_modal.value?.validate();
        if (!form_modal.value.isValid) return;

        const params = GenerateFormFn();

        // crear borrador
        if (route.name == 'crearFranquicia') {
            if (!VerifyRolesFn('CREAR_BORRADOR')) return;

            const { data, status } = await franquicia_service.postBorrador(params);

            if (status === 201) {
                store_ref.load_form = true;

                let routeName = 'verFranquicia';

                if (VerifyRolesFn('ACTUALIZAR_FRANQUICIA')) routeName = 'editarFranquicia';

                router.push({ name: routeName, params: { id: data.franquicia_id } }).then(() => {
                    utils_store.setNotification({
                        type: 'success',
                        message: data.message || 'Franquicia guardada como borrador',
                        timeout: 3000,
                    });
                });
            }
        }

        // editar borrador
        if (route.name == 'editarFranquicia') {
            if (!VerifyRolesFn('ACTUALIZAR_FRANQUICIA')) return;
            const differences = GetDifferencesFn(params);

            if (Object.keys(differences).length === 0) {
                utils_store.setNotification({
                    type: 'warning',
                    message: 'No se detectaron cambios',
                    timeout: 3000,
                });

                return;
            }

            const { data, status } = await franquicia_service.putBorrador(route.params.id, differences);

            if (status === 200) {
                utils_store.setNotification({
                    type: 'success',
                    message: data.message || 'Franquicia actualizada correctamente',
                    timeout: 3000,
                });

                store_ref.ResetStoreAct();
                await store_ref.FetchDataFranquiciaAct(route.params.id)
            }
        }
    }

    /** @description Función para enviar la franquicia a revisión */
    async function SendFranquiciaFn() {
        const { guia_aerea, embarque, mercaderia, carta_porte, dmti, duca, itinerario } = store_ref

        const hasContent = !!(guia_aerea || embarque || mercaderia || carta_porte || dmti || duca || itinerario);

        if (!hasContent) {
            alert_no_content.value = true
            return
        }

        const params = GenerateFormFn();

        let response;

        if (route.name === 'crearFranquicia') {
            response = await franquicia_service.postFranquicia(params);
        } else if (route.name === 'editarFranquicia') {
            response = await franquicia_service.putFranquicia(route.params.id, params);
        }

        if (response && ((route.name === 'crearFranquicia' && response.status === 201) || (route.name === 'editarFranquicia' && response.status === 200))) {
            store_ref.load_form = true;
            router.push({
                name: 'verFranquicia',
                params: { id: route.name === 'crearFranquicia' ? response.data.franquicia_id : route.params.id }
            }).then(() => {
                utils_store.setNotification({
                    type: 'success',
                    message: response.data.message || 'Franquicia enviada correctamente',
                    timeout: 3000,
                });
            });
        }
    }


    /** @description Función para resolver las observaciones de la franquicia */
    async function ResolveFranquiciaFn() {
        const { guia_aerea, embarque, mercaderia, carta_porte, dmti, duca, itinerario } = store_ref

        const hasContent = !!(guia_aerea || embarque || mercaderia || carta_porte || dmti || duca || itinerario);

        if (!hasContent) {
            alert_no_content.value = true
            return
        }

        const params = GenerateFormFn();

        const { data, status } = await franquicia_service.putResolveFranq(route.params.id, params);

        if (status === 200) {
            if (route.name == 'verFranquicia') {
                store_ref.ResetStoreAct();
                await store_ref.FetchDataFranquiciaAct(route.params.id)
                utils_store.setNotification({
                    type: 'success',
                    message: data.message || 'Franquicia enviada correctamente',
                    timeout: 3000,
                });

                return
            }

            router.push({ name: 'verFranquicia', params: { id: route.params.id } }).then(() => {
                utils_store.setNotification({
                    type: 'success',
                    message: data.message || 'Franquicia enviada correctamente',
                    timeout: 3000,
                });
            });
        }
    }

    /** @description Función para aprobar la franquicia */
    async function ApproveFranquiciaFn() {
        const { data, status } = await franquicia_service.putApproveFranq(route.params.id);

        if (status === 200) {
            utils_store.setNotification({
                type: 'success',
                message: data.message,
                timeout: 3000,
            });

            store_ref.ResetStoreAct();
            await store_ref.FetchDataFranquiciaAct(route.params.id)
            selected_tab.value = 'one'
        }
    }

    /** @description Función para observar la franquicia */
    async function ObserveFranquiciaFn() {
        const { valid } = await form_comment_ref.value?.validate();
        if (!valid) return;

        const { data, status } = await franquicia_service.putObserveFranq(route.params.id, {
            comentario_correccion: comment_modal.value
        });

        if (status === 200) {
            modal_comment.value = false;
            utils_store.setNotification({
                type: 'success',
                message: data.message,
                timeout: 3000,
            });

            store_ref.ResetStoreAct();
            await store_ref.FetchDataFranquiciaAct(route.params.id)
            selected_tab.value = 'one'
        }
    }

    /** @description Función para anular la franquicia */
    async function AnulateFranquiciaFn() {
        const { valid } = await form_comment_ref.value?.validate();
        if (!valid) return;

        const { data, status } = await franquicia_service.putAnulateFranq(route.params.id, { comentario_anulacion: comment_modal.value });

        if (status === 200) {
            modal_comment.value = false;
            utils_store.setNotification({
                type: 'success',
                message: data.message,
                timeout: 3000,
            });

            store_ref.ResetStoreAct();
            await store_ref.FetchDataFranquiciaAct(route.params.id)
            selected_tab.value = 'one'
        }
    }

    /** @description Función para obtener el reporte de la franquicia */
    async function PreviewFranquiciaFn() {
        const { data, status } = await report_service.getReportesById(route.params.id);

        if (status === 200) {
            const title_doc = store_ref.franquicia.codigo_franquicia || store_ref.franquicia.codigo_provisional;

            const url = window.URL.createObjectURL(data);
            const a = document.createElement("a");
            a.href = url;
            a.setAttribute(
                "download",
                `${title_doc}(${DateFormatFn()}).docx`
            );
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        }
    }

    async function SaveDatesFn() {
        const { reporte, entrega } = store_ref.fecha_importante;

        if (reporte || entrega) {
            const payload = {};
            if (reporte) payload.fecha_despacho = reporte;
            if (entrega) payload.fecha_entrega = entrega;

            const { data, status } = await franquicia_service.putActualizarFechas(route.params.id, payload);

            if (status === 200) {
                utils_store.setNotification({
                    type: 'success',
                    message: data.message,
                    timeout: 3000,
                });

                store_ref.ResetStoreAct();
                await store_ref.FetchDataFranquiciaAct(route.params.id);
            }
        }
    }

    // watch
    watch(modal_alert, (value) => {
        if (!value) {
            action_modal_alert.value = '';
        }
    })

    watch(modal_comment, (value) => {
        if (!value) {
            comment_modal.value = '';
            action_modal_alert.value = '';
        }
    })

    onBeforeUnmount(() => {
        store_ref.ResetStoreAct();
    })

    return {
        comment_modal,
        form_comment_ref,
        form_modal,
        HandlerActionModalFn,
        message_modal_alert,
        modal_alert,
        alert_no_content,
        modal_comment,
        OpenModalAlertFn,
        PreviewFranquiciaFn,
        RULES_CONST,
        SaveBorradorFn,
        selected_tab,
        store_ref,
        title_modal_alert,
        SaveDatesFn,
        VerifyRolesFn,
        ViewTabAdjuntosFn,
        ViewTabRatingFn
    }
}