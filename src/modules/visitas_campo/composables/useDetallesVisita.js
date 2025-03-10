import { ref, watch } from "vue";
import visitas_camposServices from "@/services/visitas_campos.services";
import { useRouter } from "vue-router";
import { useVistCampStore } from '../store';

export function useDetallesVisita() {

  const entidad = ref(null) //Entidad seleccionada
  const franquicia = ref(null) //Franquicia seleccionada
  const today = new Date().toISOString().substr(0, 10)
  const date_vist_camp = ref(today) //Fecha de visita, definida por defecto en el componente con la fecha actual
  const category = ref(null) //Categoria seleccionada
  const list_files = ref([]) //Lista de archivos
  const list_names = ref([]) //Lista de nombres como objeto {name: 'nombre'}
  const listNamesClean = ref([]) //Lista de nombres como string ['nombre']
  const VuetifyTiptapRef = ref(null) //Referencia al editor de texto
  const ruta = useRouter(); //Para redirigir a otra página
  const imageToShow = ref(null) //Imagen a mostrar en la vista previa
  const contador = ref(0) //Contador de archivos
  const numero_seguimiento = ref(null) //Numero de seguimiento
  const correlativo = ref(null) //Contador de archivos para edición
  const detalles = ref(null) //Detalles de la visita
  const isLoaded = ref(false) //Para saber si se ha cargado la información de la visita
  const showOverlay = ref(null); //Para mostrar u ocultar el overlay
  const isOpen = ref(false) //Indica si el modal de vista previa está abierto
  const estado = ref(null) //Estado de la visita
  const store_ref = useVistCampStore(); // store

  async function getVisitaCampo(id) {

    const { data, status } = await visitas_camposServices.getVisitaCampo(id)

    if (status === 200) {

      numero_seguimiento.value = data.numero_seguimiento;
      correlativo.value = data.correlativo;
      entidad.value = data.entidad;
      franquicia.value = data.codigo_franquicia;
      date_vist_camp.value = data.fecha_visita;
      category.value = data.categoria_visita_id;
      detalles.value = data.detalle;
      estado.value = data.estado;


      //Archivos
      data.archivos.forEach((file, index) => {

        //Nombre del archivo y tipo
        const fileName = file.nombre_archivo;
        const BASE = file.base64
        const type = file.extension;
        const base64 = `data:image/${type};base64,${file.base64}`;

        //BLOB METHOD
        //Convertir el base64 a un archivo
        const byteCharacters = atob(BASE);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: type });
        //Crear un nuevo archivo con el blob
        const newFile = new File([blob], fileName, { type: type });
        const imageUrl = URL.createObjectURL(newFile);

        //Agregar el archivo a la lista de archivos
        list_files.value.push({ file: fileName, url: base64, type: type, imageUrl: imageUrl });
      });
      //Nombres
      data.nombres.forEach((name) => {
        list_names.value.push({ name: name });
      });

      isLoaded.value = true;

    }


  }

  async function printReport(id) {

    const { data, status } = await visitas_camposServices.getReporteById(id);

    if (status === 200) {
      const blob = new Blob([data], { type: "application/pdf" });

      const url = URL.createObjectURL(blob);

      const newWindow = window.open(url, "_blank");
    }

  }

  function isVisible(index) {
    return showOverlay.value === index;
  }

  function ToggleVisibilityFn(index) {
    showOverlay.value = showOverlay.value === index ? null : index;
  }

  // Open the modal and show the image
  function openShowModal(file) {

    if (file) {
      imageToShow.value = file.url;
      isOpen.value = true;
    } else {
      utils_ref.setNotification({
        message: "No se pudo abrir el archivo",
        type: "error",
      });
      cleanup();
    }

  }

  // Cleanup URLs to prevent memory leaks
  function cleanup() {
    if (imageToShow.value) {
      URL.revokeObjectURL(imageToShow.value);
      imageToShow.value = "";
    }
  }

  // Watch for changes to the isOpen ref and cleanup when it becomes false
  watch(isOpen, (newVal) => {
    if (!newVal) cleanup();
  });

  function downloadFile(file) {
    const url = file.imageUrl;
    const a = document.createElement("a");
    a.href = url;
    a.download = file.file;
    a.click();
    URL.revokeObjectURL(url);
  }

  function backToListView() {
    store_ref.entidad_seguimiento = null;
    store_ref.franquicia_seguimiento = null;
    ruta.push("/visitas-campo");
  }

  function backToSeguimiento() {
    store_ref.seguimientoFlag = false;
    ruta.push(`/detalle-seguimiento/${store_ref.seguimientoId}`);
  }


  return {
    entidad,
    franquicia,
    today,
    date_vist_camp,
    category,
    list_files,
    list_names,
    listNamesClean,
    VuetifyTiptapRef,
    ruta,
    imageToShow,
    contador,
    numero_seguimiento,
    correlativo,
    detalles,
    isLoaded,
    showOverlay,
    isOpen,
    estado,
    store_ref,
    getVisitaCampo,
    printReport,
    isVisible,
    openShowModal,
    ToggleVisibilityFn,
    downloadFile,
    backToListView,
    backToSeguimiento,

  }

}
