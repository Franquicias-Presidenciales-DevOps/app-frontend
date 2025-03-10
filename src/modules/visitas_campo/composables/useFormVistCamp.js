import { ref, watch } from 'vue'
import { isImage, maxlength, required, textfield } from '@/utils/validations'
import visitas_camposServices from '@/services/visitas_campos.services';
import { useRouter } from "vue-router";
import { useUtilsStore } from '@/store/utils';
import TipTap from './useTipTap';
import useTipTap from './useTipTap';

import { useVistCampStore } from '../store';

const utils_ref = useUtilsStore();
const store_ref = useVistCampStore();
const { content, maximo } = useTipTap();

export default function useFormVistCamp() {

  const entidades = ref([]) //Lista de entidades
  const franquicias = ref([]) //Lista de franquicias
  const categorias = ref([]) //Lista de categorias
  const form_files = ref(null) //Referencia al formulario de archivos
  const form_names = ref(null) //Referencia al formulario de nombres
  const entidad = ref(null) //Entidad seleccionada
  const franquicia = ref(null) //Franquicia seleccionada
  const today = new Date().toISOString().substr(0, 10)
  const date_vist_camp = ref(today) //Fecha de visita, definida por defecto en el componente con la fecha actual
  const category = ref(null) //Categoria seleccionada
  const file_vist_camp = ref(null) //Archivo seleccionado
  const name_vist_camp = ref(null) //Nombre seleccionado
  const list_files = ref([]) //Lista de archivos
  const list_names = ref([]) //Lista de nombres como objeto {name: 'nombre'}
  const listNamesClean = ref([]) //Lista de nombres como string ['nombre']
  const VuetifyTiptapRef = ref(null) //Referencia al editor de texto
  const ruta = useRouter(); //Para redirigir a otra página
  const isDraft = ref(false) //Indica si la visita de campo es un borrador
  const isOpen = ref(false) //Indica si el modal de vista previa está abierto
  const imageToShow = ref(null) //Imagen a mostrar en la vista previa
  const contador = ref(0) //Contador de archivos
  const isConfirmModal = ref(false) //Indica si el modal de confirmación está abierto
  const confirmModalData = ref({}) //Datos del modal de confirmación
  const entidad_id = ref(null) //Id de la entidad seleccionada
  const hasContent = ref(false) //Indica si el editor de texto tiene contenido

  //Edicion
  const numero_seguimiento = ref(null) //Numero de seguimiento
  const editMode = ref(false) //Indica si el formulario está en modo edición
  const correlativo = ref(null) //Contador de archivos para edición
  const editContent = ref(null) //Contenido del editor de texto para edición
  const estado = ref(null) //Estado de la visita de campo

  // Validaciones
  const RULES = {
    entidad: [required],
    n_franquicia: [required],
    //date_vist_camp: [required],
    //category: [required],
  }

  const regex = /^[A-Za-zñÑáéíóúÁÉÍÓÚüÜ'0-9&#., -_]*$/
  const RULE_FILE = [(value) => isImage(value, null, 5000000)]
  const RULE_NAME = [(value) => textfield(value, null, regex), (value) => maxlength(value, "Debe ingresar menos de 150 caracteres.", 151)]

  // async functions
  // AddFileFn: Agrega un archivo a la lista de archivos
  const AddFileFn = async (file) => {
    const { valid } = await form_files.value?.validate();
    if (!valid) return;

    contador.value += 1;

    const newFileName = `ArchivoAdjunto${contador.value}.${file.name.split('.').pop()}`;
    const renamedFile = new File([file], newFileName, { type: file.type });
    const newId = list_files.value.length + 1;
    const fileWithId = {
      id: newId,
      file: renamedFile,
    };

    list_files.value.push(fileWithId);
    file_vist_camp.value = null;
  };

  // DeleteFileFn: Elimina un archivo de la lista de archivos
  const DeleteFileFn = (item) => {

    const index = list_files.value.indexOf(item)
    list_files.value.splice(index, 1)

  }

  // AddNameFn: Agrega un nombre a la lista de nombres
  const AddNameFn = async () => {
    const { valid } = await form_names.value?.validate();
    if (!valid) return;

    if (!name_vist_camp.value) return;

    list_names.value.push({ name: name_vist_camp.value })
    name_vist_camp.value = null
  }

  // DeleteNameFn: Elimina un nombre de la lista de nombres
  const DeleteNameFn = (item) => {
    const index = list_names.value.indexOf(item)
    list_names.value.splice(index, 1)
  }

  //Obtener entidades
  async function FetchEntidadesFn() {

    //Solo si viene del boton Agregar Reporte, se llena con los datos de la entidad y franquicia de store_ref
    if (store_ref.addReportFlag === true) {
      //Asignar valorea
      entidad.value = store_ref.entidad_seguimiento;
      franquicia.value = store_ref.franquicia_seguimiento;

      //Limpiar valores
      store_ref.addReportFlag = false;
    }

    const { data, status } = await visitas_camposServices.getFiltroEntidades()

    if (status === 200) {
      entidades.value = data
    }
  }

  async function getFranquicia() {

    franquicia.value = null;

    if (entidad.value.institucion_id) {

      entidad_id.value = entidad.value.institucion_id;
      const response = await visitas_camposServices.getFiltroFranquicias({
        institucion_id: entidad_id.value,
        oficial_id: null,
      });
      franquicias.value = response.data.codigos;
    } else {

      entidad_id.value = entidad.value.oficial_id;
      const response = await visitas_camposServices.getFiltroFranquicias({
        institucion_id: null,
        oficial_id: entidad_id.value,
      });
      franquicias.value = response.data.codigos;
    }

  }

  //Obtener categorias
  async function FetchCategoriasFn() {
    const { data, status } = await visitas_camposServices.getCategoriasVisita()

    if (status === 200) {
      categorias.value = data
    }
  }

  //Obtener el contenido del editor de texto en formato HTML
  function transformHTML() {
    const value = VuetifyTiptapRef.value?.editor.getHTML();

    //Transformar los <p></p> en <br>, solo si estan vacios los <p>
    const newValue = value.replace(/<p><\/p>/g, "<br>");

    return newValue;
  }

  //Obtener los nombres de la lista de nombres como array de strings
  function getNames() {
    listNamesClean.value = list_names.value.map((item) => item.name)
    return listNamesClean.value;
  }

  //Enviar la información del formulario al backend
  async function submit() {

    getNames();

    const formData = new FormData();
    formData.append("codigo_franquicia", franquicia.value);

    if (category.value) {
      formData.append("categoria_visita_id", category.value);
    }
    formData.append("detalle", transformHTML());

    if (date_vist_camp.value) {
      formData.append("fecha_visita", date_vist_camp.value);
    }

    formData.append("estado_id", isDraft.value ? 1 : 8);

    listNamesClean.value.forEach((name, index) => {
      formData.append(`nombres[${index}]`, name);
    });

    list_files.value.forEach((file, index) => {
      formData.append(`archivos[${index}]`, file.file);
    });

    //const valid = await formData.value?.validate();

    try {

      if (editMode.value === true) {
        const response = await visitas_camposServices.updateVisitaCampo(ruta.currentRoute._value.params.id, formData);
        if (response.status === 200) {
          utils_ref.setNotification({
            message: isDraft.value ? "Borrador guardado correctamente" : "Visita de campo creada correctamente",
            type: "success",
          });
        }
      }
      else {
        const response = await visitas_camposServices.createVisitaCampo(formData);
        if (response.status === 201) {
          utils_ref.setNotification({
            message: isDraft.value ? "Borrador guardado correctamente" : "Visita de campo creada correctamente",
            type: "success",
          });
        }
      }

    } catch (error) {

      utils_ref.setNotification({
        message: isDraft.value ? "Error al guardar el borrador" : "Error al crear la visita de campo",
        type: "error",
      });

      isDraft.value = false;

      return;

    } finally {

      isDraft.value = false;
      setTimeout(() => {
        backToListView();
      }, 1000);
    }
  }

  //Guardar la visita de campo como borrador
  async function draft() {

    isDraft.value = true;
    submit();

  }

  //Redirigir a la lista de visitas de campo
  function backToListView() {
    store_ref.entidad_seguimiento = null;
    store_ref.franquicia_seguimiento = null;
    ruta.push("/visitas-campo");
  }

  // Open the modal and show the image
  function openShowModal(file) {

    if (file) {
      imageToShow.value = URL.createObjectURL(file.file);
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

  function confirmModalOption(option) {
    switch (option) {
      case 1:
        confirmModalData.value = {
          title: "¿Está seguro de cancelar el registro del seguimiento?",
          message: "Al confirmar la acción no se guardará ninguna información",
          option: option
        }
        break;

      case 2:
        confirmModalData.value = {
          title: "Guardar como borrador",
          message: "Al guardar como borrador podrá seguir editando posteriormente, pero no podrá imprimirlo",
          option: option
        }
        break;
      case 3:
        confirmModalData.value = {
          title: "Confirmar seguimiento",
          message: "Al confirmar el seguimiento el estado será finalizado y podrá imprimir el seguimiento",
          option: option
        }
        break;

      default:
        break;
    }

    isConfirmModal.value = true;
  }

  function confirmAction(option) {
    switch (option) {
      case 1:
        backToListView();
        break;

      case 2:
        draft();
        break;

      case 3:
        submit();
        break;

      default:
        break;
    }
  }

  //Get the visitaCampo data to edit
  async function getVisitaCampo(id) {

    editMode.value = true;

    const { data, status } = await visitas_camposServices.getVisitaCampo(id)

    if (status === 200) {


      numero_seguimiento.value = data.numero_seguimiento;
      correlativo.value = data.correlativo;
      entidad.value = data.entidad;

      //Obtener las franquicias
      getFranquicia();

      franquicia.value = data.codigo_franquicia;
      date_vist_camp.value = data.fecha_visita;
      category.value = data.categoria_visita_id;



      maximo.value = data.detalle.length;

      let contenido = data.detalle;

      editContent.value = contenido.replace(/<p><br><\/p>/g, "<p></p>");
      editContent.value = contenido.replace(/<br>/g, "<p></p>");

      content.value = data.detalle;

      //Archivos
      data.archivos.forEach((file, index) => {

        //Nombre del archivo y tipo
        const fileName = file.nombre_archivo;
        const base64 = file.base64;
        const type = file.extension;

        //Convertir el base64 a un archivo
        const byteCharacters = atob(base64); //atob decodifica una cadena de datos que ha sido codificada en base-64
        const byteNumbers = new Array(byteCharacters.length); //Crea un array de la longitud de la cadena
        for (let i = 0; i < byteCharacters.length; i++) { //Recorre la cadena
          byteNumbers[i] = byteCharacters.charCodeAt(i); //Devuelve un número indicando el valor Unicode del carácter en el índice proporcionado
        }

        const byteArray = new Uint8Array(byteNumbers); //Crea un array de 8 bits sin signo
        const blob = new Blob([byteArray], { type: type }); //Crea un blob con el array de bytes

        //Crear un nuevo archivo con el blob
        const newFile = new File([blob], fileName, { type: type });

        //Agregar el archivo a la lista de archivos
        list_files.value.push({ id: index, file: newFile });

      });

      contador.value = list_files.value.length;

      //Nombres
      data.nombres.forEach((name) => {
        list_names.value.push({ name: name });
      });

      estado.value = data.estado;
      checkEditContent(editContent);

    }

  }

  const checkContent = (content) => {
    hasContent.value = content.length > 7
  }

  const checkEditContent = (content) => {
    hasContent.value = content.value.length > 0
  }

  // Watch for changes to the isOpen ref and cleanup when it becomes false
  watch(isOpen, (newVal) => {
    if (!newVal) cleanup();
  });


  return {
    entidad,
    franquicia,
    date_vist_camp,
    category,
    file_vist_camp,
    name_vist_camp,
    list_files,
    list_names,
    RULES,
    RULE_FILE,
    RULE_NAME,
    form_files,
    form_names,
    entidades,
    franquicias,
    categorias,
    VuetifyTiptapRef,
    isDraft,
    isConfirmModal,
    today,
    isOpen,
    imageToShow,
    confirmModalData,
    ruta,
    editMode,
    correlativo,
    editContent,
    numero_seguimiento,
    estado,
    hasContent,
    store_ref,
    confirmAction,
    confirmModalOption,
    getFranquicia,
    FetchEntidadesFn,
    FetchCategoriasFn,
    submit,
    draft,
    DeleteFileFn,
    DeleteNameFn,
    backToListView,
    AddFileFn,
    AddNameFn,
    openShowModal,
    getVisitaCampo,
    checkContent,
    checkEditContent,
  }
}
