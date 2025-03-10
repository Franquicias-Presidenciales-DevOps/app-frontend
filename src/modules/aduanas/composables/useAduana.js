// utils
import { ref, reactive } from "vue";
import { required, textfield, minlength } from "@/utils/validations";
import { useUtilsStore } from "@/store/utils";

// services
import aduanas_services from "@/services/aduanas.services";

export function useAduana() {
    // variables
    // buscador
    const search_var = ref(null);
    const temp_search_var = ref("");
    const filter_by_var = ref("all");

    // listado
    const per_page_var = ref(10);
    const page = ref(1);
    const list_aduanas_var = ref([]);
    const total_aduanas_var = ref(0);
    const loading_var = ref(false);

    // add/edit
    const show_add_var = ref(false);
    const nombre_var = ref(null);
    const selected_aduana_var = ref({});
    const form_modal_ref = ref(null);

    const modal_confirmation = reactive({
        show: false,
        is_active: false,
        id: null,
    });

    // constants
    // headers de la tabla
    const HEADERS_CONST = [
        { title: "N°", key: "id", sortable: false },
        { title: "Nombre", key: "nombre", sortable: false },
        { title: "Creador", key: "creador", sortable: false },
        { title: "Editor", key: "editor", sortable: false },
        { title: "Fecha de creación", key: "fecha_creacion", sortable: false },
        { title: "Fecha de edición", key: "fecha_edicion", sortable: false },
        { title: "Estado", key: "activo", sortable: false, align: "center" },
        { title: "Acciones", key: "actions", sortable: false, align: "center" },
    ];

    // reglas de validación
    const RULES_CONST = {
        temp_search_var: [
            (value) => required(value, "Ingresa un valor para buscar"),
            textfield,
            (value) => minlength(value, null, 4),
        ],
        nombre_var: [
            (value) => required(value, "Ingresa el nombre de la aduana"),
            textfield,
            (value) => minlength(value, null, 4),
        ],
    };

    // refs
    const utils_ref = useUtilsStore();

    // regular functions
    /**
     * @description limpia los campos de búsqueda
     */
    function CleanSearcherFn() {
        if (search_var.value != "" || search_var.value != null) {
            temp_search_var.value = "";
            search_var.value = "";
            filter_by_var.value = "all";

            FetchListAduanasFn({ page: 1, itemsPerPage: per_page_var.value });
        }
    }

    /**
     * @description inyecta la información de la aduana seleccionada para editar
     */
    function InjectInfoEditFn(aduana) {
        selected_aduana_var.value = aduana;
        nombre_var.value = aduana.nombre;
        show_add_var.value = true;
    }

    /**
     * @description cierra el modal de add/edit aduana
     */
    function CloseModalFn() {
        show_add_var.value = false;
        nombre_var.value = null;
        selected_aduana_var.value = {};
    }

    // async functions
    /**
     * @description función que se encarga de realizar la búsqueda
     * @param {Promise} event_param - evento de búsqueda
     */
    async function SearchFn(event_param) {
        const { valid } = await event_param;

        if (valid) {
            search_var.value = temp_search_var.value;
        }
    }

    /**
     * @description función que se encarga de lanzar funciones de guardar o actualizar aduana
     */
    async function HandlerAduanaFn() {
        const { valid } = await form_modal_ref.value?.validate();

        if (!valid) return;

        if (Object.keys(selected_aduana_var.value).length === 0) {
            SaveAduanaFn();
            return;
        }

        if (selected_aduana_var.value?.nombre === nombre_var.value) {
            utils_ref.setNotification({
                type: 'warning',
                message: 'El nombre de la aduana no ha cambiado',
                timeout: 5000,
            });

            return;
        }

        UpdateAduanaFn();
    }

    function OpenModalConfirmationFn(item) {
        modal_confirmation.show = true;
        modal_confirmation.id = item.id;
        modal_confirmation.is_active = item.activo;
    }

    /**
     * @description función que se encarga de obtener la lista de aduanas
     * @param {Number} page - página actual
     * @param {Number} itemsPerPage - cantidad de items por página
     */
    async function FetchListAduanasFn({ page: pageItem, itemsPerPage }) {
        loading_var.value = true;
        const { data, status, headers } = await aduanas_services.getListAduanas({
            page: pageItem,
            per_page: itemsPerPage || per_page_var.value,
            nombre: search_var.value,
            activo: filter_by_var.value,
        });
        if (status === 200) {
            list_aduanas_var.value = data;
            total_aduanas_var.value = headers["total_rows"];
            page.value = pageItem;

        }
        loading_var.value = false;
    }

    /**
     * @description función que se encarga de guardar una aduana
     */
    async function SaveAduanaFn() {
        const { data, status } = await aduanas_services.postAduana({
            nombre: nombre_var.value,
        });
        if (status === 201) {
            show_add_var.value = false;
            nombre_var.value = null;
            FetchListAduanasFn({ page: 1, itemsPerPage: per_page_var.value });
            utils_ref.setNotification({
                type: 'success',
                message: data?.message ?? 'Aduana creada correctamente',
                timeout: 5000,
            });
        }
    }

    /**
     * @description función que se encarga de actualizar una aduana
     */
    async function UpdateAduanaFn() {
        const { data, status } = await aduanas_services.putAduana(selected_aduana_var.value?.id, {
            nombre: nombre_var.value,
        });
        if (status === 200) {
            show_add_var.value = false;
            nombre_var.value = null;
            FetchListAduanasFn({ page: 1, itemsPerPage: per_page_var.value });
            utils_ref.setNotification({
                type: 'success',
                message: data?.message ?? 'Aduana actualizada correctamente',
                timeout: 5000,
            });
        }

        CloseModalFn();
    }

    /**
     * @description función que se encarga de cambiar el estado de una aduana
     * @param {Object} aduana - aduana a cambiar de estado
     */
    async function ChangeStatusAduanaFn(id_aduana) {
        const { data, status } = await aduanas_services.patchAduana(id_aduana);
        if (status === 200) {
            FetchListAduanasFn({ page: 1, itemsPerPage: per_page_var.value });
            utils_ref.setNotification({
                type: 'success',
                message: data?.message ?? 'Estado de la aduana actualizado correctamente',
                timeout: 5000,
            });
            modal_confirmation.show = false;
        }
    }

    return {
        temp_search_var,
        search_var,
        filter_by_var,
        per_page_var,
        page,
        list_aduanas_var,
        total_aduanas_var,
        loading_var,

        show_add_var,
        nombre_var,
        selected_aduana_var,
        form_modal_ref,
        modal_confirmation,

        HEADERS_CONST,
        RULES_CONST,

        ChangeStatusAduanaFn,
        CleanSearcherFn,
        CloseModalFn,
        FetchListAduanasFn,
        HandlerAduanaFn,
        InjectInfoEditFn,
        SaveAduanaFn,
        SearchFn,
        UpdateAduanaFn,
        OpenModalConfirmationFn
    };
}

