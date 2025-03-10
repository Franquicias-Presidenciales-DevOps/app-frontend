// utils
import { ref, reactive, onBeforeUnmount } from 'vue'
import { useRouter } from "vue-router";

// services
import visitas_camposServices from '@/services/visitas_campos.services';

// store
import { useVistCampStore } from '../store';
import { useUtilsStore } from "@/store/utils";

export default function useListVistCamps() {
  // references
  const router_ref = useRouter()
  const store_ref = useVistCampStore() // store
  const utils_store = useUtilsStore();

  // variables
  const selected_tab = ref('one')
  const load_list_seg_gen = ref(false)
  const load_list_seg_franq = ref(false)
  const show_filter_gen = ref(true)
  const show_filter_franq = ref(true)
  const show_modal_delete = ref(false)

  const item_selected = ref(null)
  const list_seg_gen = ref([])
  const list_seg_franq = ref([])

  const pag_seg_gen = reactive({
    page: 1,
    per_page: 10,
    total: 0
  })
  const pag_seg_franq = reactive({
    page: 1,
    per_page: 10,
    total: 0
  })

  const HEADERS_LIST_SEG_GEN = [
    { title: 'No. De seguimiento', key: 'numero_seguimiento', align: 'center', sortable: false },
    { title: 'Correlativo de seguimiento', key: 'correlativo', align: 'center', sortable: false },
    { title: 'Entidad', key: '_entidad', maxWidth: '550px', sortable: false },
    { title: 'Código de franquicia', key: 'codigo_franquicia', sortable: false },
    { title: 'Fecha de visita', key: 'fecha_visita', align: 'center', sortable: false },
    { title: 'Estado', key: 'status', align: 'center', sortable: false },
    { title: 'Acciones', key: 'actions', sortable: false, align: 'center' },
  ]

  const HEADERS_LIST_SEG_FRANQ = [
    { title: 'No. De seguimiento', key: 'numero_seguimiento', align: 'center', sortable: false },
    { title: 'Entidad', key: '_entidad', maxWidth: '650px', sortable: false },
    { title: 'Código de franquicia', key: 'codigo_franquicia', sortable: false },
    { title: 'Acciones', key: 'actions', sortable: false, align: 'center', sortable: false },
  ]

  // async functions
  async function FetchListSegGenFn({ page, itemsPerPage, resetVal = false }) {
    load_list_seg_gen.value = true

    let payload = {}

    if (store_ref?.enable_filter_s_g) {
      const { entidad, n_franquicia, n_seguimiento, fecha_inicio, fecha_fin } = store_ref.filter_s_g

      payload = {
        oficial_id: entidad?.oficial_id || undefined,
        institucion_id: entidad?.institucion_id || undefined,
        numero_franquicia: n_franquicia || undefined,
        numero_seguimiento: n_seguimiento || undefined,
        fecha_inicio: fecha_inicio || undefined,
        fecha_fin: fecha_fin || undefined,
      }
    }

    const { data, status, headers } =
      await visitas_camposServices.getListSegGen({
        page,
        per_page: itemsPerPage,
        ...payload
      })

    if (status === 200) {
      list_seg_gen.value = data
      pag_seg_gen.total = Number(headers['total_rows'])

      if (resetVal) {
        pag_seg_gen.page = page
        pag_seg_gen.per_page = itemsPerPage
      }
    }
    load_list_seg_gen.value = false
  }

  async function FetchListSegFranqFn({ page, itemsPerPage, resetVal }) {
    load_list_seg_franq.value = true

    let payload = {}

    if (store_ref?.enable_filter_s_f) {
      const { entidad, n_franquicia, n_seguimiento } = store_ref.filter_s_f

      payload = {
        oficial_id: entidad?.oficial_id || undefined,
        institucion_id: entidad?.institucion_id || undefined,
        numero_franquicia: n_franquicia || undefined,
        numero_seguimiento: n_seguimiento || undefined,
      }
    }

    const { data, status, headers } =
      await visitas_camposServices.getListSegFranq({
        page,
        per_page: itemsPerPage,
        ...payload
      })

    if (status === 200) {
      list_seg_franq.value = data
      pag_seg_franq.total = headers['total_rows']

      if (resetVal) {
        pag_seg_franq.page = page
        pag_seg_franq.per_page = itemsPerPage
      }
    }
    load_list_seg_franq.value = false
  }

  const PrintReportFn = async (item) => {
    const { data, status } = await visitas_camposServices.getReporteById(item.id)

    if (status == 200) {
      const blob = new Blob([data], { type: "application/pdf" });

      const url = URL.createObjectURL(blob);

      const newWindow = window.open(url, "_blank");
    }

  }

  const DeleteSegFn = async () => {
    const { data, status } = await visitas_camposServices.deleteVistCamp(item_selected.value.id)

    if (status === 200) {
      item_selected.value = null
      show_modal_delete.value = false

      utils_store.setNotification({
        type: 'success',
        message: data.message || 'Elemento eliminado',
        timeout: 3000,
      });

      FetchListSegGenFn({ page: 1, itemsPerPage: 10, resetVal: true })
    }
  }

  onBeforeUnmount(() => {
    store_ref.ResetListVistCampAc()
  })

  return {
    selected_tab,
    load_list_seg_gen,
    load_list_seg_franq,
    show_filter_gen,
    show_filter_franq,
    show_modal_delete,
    item_selected,
    list_seg_gen,
    list_seg_franq,

    pag_seg_gen,
    pag_seg_franq,

    HEADERS_LIST_SEG_GEN,
    HEADERS_LIST_SEG_FRANQ,

    FetchListSegGenFn,
    FetchListSegFranqFn,
    PrintReportFn,
    DeleteSegFn,

    router_ref
  }
}
