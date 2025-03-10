// utils
import { required, textarea } from "@/utils/validations";
import { ref, computed, onMounted, toRaw } from "vue";
import { useDisplay } from "vuetify";
import { VerifyRolesFn } from "@/utils/global_functions";

// references
import franquiciasServices from "@/services/franquicias.services";
import { useFrancqStore } from "../franquicias.store";
import { useUtilsStore } from "@/store/utils";

export default function useRateFranquicia() {
    // variables
    const comentario_anotacion = ref(null);
    const adjunto_file = ref([]);
    const list_obs_rate = ref([])
    const load_list_obs = ref(false)
    const show_modal = ref(false)
    const file_image = ref(null)
    const file_title = ref(null)

    const original_data_rate = ref([]);
    const editable_data_rate = ref([]);
    const nombre_entidad = ref("");
    const init_rate = ref(false);

    // constantes
    const HEADERS = [
        { title: "N°", key: "num" },
        { title: "Observación", key: "comentario" },
        { title: "Adjunto", key: "adjunto" },
        { title: "Acciones", key: "actions", sortable: false },
    ];

    const regex = /^[A-Za-zñÑáéíóúÁÉÍÓÚüÜ0-9 ,-.#/()]*$/;
    const RULES_CONST = {
        colaboracion_franquicia: [required, (value) => textarea(value, null, regex)],
    };

    // references
    const form_ref = ref(null);
    const adjnt_ref = ref(null);
    const store_ref = useFrancqStore();
    const utils_ref = useUtilsStore();
    const { smAndDown } = useDisplay();

    // funciones regulares
    function VerifyRateFn() {
        const hasChanges = original_data_rate.value.some((originalItem, index) => {
            return originalItem.puntaje !== editable_data_rate.value[index].puntaje;
        });

        if (!hasChanges) {
            utils_ref.setNotification({
                type: "warning",
                message: "No se han registrado cambios.",
                timeout: 3000,
            });

            return;
        }

        SaveRateFn();
    }

    // funciones asincronas
    // <-- calificacion -->
    async function FetchRateFn() {
        const { data, status } = await franquiciasServices.getRateFranquicia(
            store_ref.franquicia?.id
        );

        if (status == 200) {
            original_data_rate.value = JSON.parse(JSON.stringify(data.clasificaciones));
            editable_data_rate.value = JSON.parse(JSON.stringify(data.clasificaciones));
            nombre_entidad.value = data.entidad;
            init_rate.value = data.has_score;
        }
    }

    async function FetchGlobalRateFn() {
        const { data, status } = await franquiciasServices.getGlobalRateFranquicia(
            store_ref.franquicia?.id
        );

        if (status == 200) {
            original_data_rate.value = JSON.parse(JSON.stringify(data.clasificaciones));
            editable_data_rate.value = JSON.parse(JSON.stringify(data.clasificaciones));
            nombre_entidad.value = data.entidad;
        }
    }

    async function SaveRateFn() {
        const clasificaciones = editable_data_rate.value.map((item) => {
            const { id, puntaje } = item;

            return {
                clasificacion_id: id,
                puntaje,
            };
        });

        const payload = {
            franquicia_id: store_ref.franquicia?.id,
            clasificaciones: clasificaciones,
        };

        const { data, status } = await franquiciasServices.postRateFranquicia(
            payload
        );

        if (status === 200 || status === 201) {
            if (status === 201) {
                init_rate.value = true;
            }

            utils_ref.setNotification({
                type: "success",
                message: data.message || "Datos actualizados.",
            });

            original_data_rate.value = JSON.parse(
                JSON.stringify(editable_data_rate.value)
            );
        }
    }

    // <-- observaciones -->
    async function ValidCommentsFn() {
        await form_ref.value?.validate();
        if (!form_ref.value.isValid) return;

        const formData = new FormData()

        formData.append('franquicia_id', store_ref.franquicia?.id)
        formData.append("comentario", comentario_anotacion.value);
        const file = Array.from(adjunto_file?.value).at(0)
        if (file) {
            formData.append("archivo", file);
        }

        const { data, status } = await franquiciasServices.postObsRate(formData)

        if (status == 201) {
            utils_ref.setNotification({
                type: "success",
                message: data.message,
            });

            if (file) { adjnt_ref.value.deleteFile(file.name) }
            adjnt_ref.value.resetValidation()
            comentario_anotacion.value = null
            adjunto_file.value = []

            // list_obs_rate.value.unshift(data.observacion)
            FetchListObservacionesFn()
        }
    }

    async function FetchListObservacionesFn() {
        const { data, status } = await franquiciasServices.getListObsRate(store_ref.franquicia?.id, { per_page: -1 })

        if (status == 200) {
            list_obs_rate.value = data?.observaciones
        }
    }

    async function DeleteObsFn(item) {
        const { data, status } = await franquiciasServices.deleteObsRate(item?.id)

        if (status == 200) {
            list_obs_rate.value = list_obs_rate.value.filter(objeto => objeto.id !== item?.id);

            utils_ref.setNotification({
                type: "success",
                message: data.message || "Observación eliminada.",
            });
        }
    }

    async function FetchDetailFileFn(item) {
        const { data, status } = await franquiciasServices.getFileObsRate(item?.id);

        if (status === 200) {
            if (data.extension === "pdf") {
                FetchDocumentFn(data);
            } else {
                file_title.value = data.filename;
                file_image.value = `data:image/png;base64,${data.content_file}`;
                show_modal.value = true;
            }
        }
    }

    function FetchDocumentFn(data) {
        // Crear un enlace de datos a partir de la cadena base64
        const linkSource = `data:application/pdf;base64,${data.content_file}`;

        // Separar el prefijo de la cadena base64
        const base64String = linkSource.split(",")[1];

        // Convertir la cadena base64 a un array de bytes
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        // Crear un Blob a partir del array de bytes
        const blob = new Blob([byteArray], { type: "application/pdf" });

        // Crear una URL de objeto a partir del Blob
        const blobUrl = URL.createObjectURL(blob);

        // Abrir la URL en una nueva pestaña
        window.open(blobUrl, "_blank");
    }

    // computed
    const general_rate = computed(() => {
        const values = editable_data_rate.value.map((item) => item?.puntaje);

        // Calcular la tasa general
        const sum = values.reduce((acc, val) => acc + val, 0);
        return (sum / values.length) * 10;
    });

    // mounted
    onMounted(() => {
        if (VerifyRolesFn('LISTAR_OBSERVACIONES')) {
            const estado = store_ref.franquicia?.estado;

            if ([2, 4].includes(estado)) {
                FetchGlobalRateFn();
            }

            if ([6, 7].includes(estado)) {
                FetchRateFn();
                FetchListObservacionesFn()
            }
        }
    });

    return {
        comentario_anotacion,
        adjunto_file,
        list_obs_rate,
        load_list_obs,
        show_modal,
        file_image,
        file_title,

        editable_data_rate,
        nombre_entidad,
        init_rate,
        HEADERS,
        RULES_CONST,
        form_ref,
        adjnt_ref,
        store_ref,
        smAndDown,

        VerifyRateFn,
        ValidCommentsFn,
        DeleteObsFn,
        FetchDetailFileFn,
        general_rate,
        VerifyRolesFn
    }
}