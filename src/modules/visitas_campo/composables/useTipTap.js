import { reactive, ref } from 'vue'
import {
  locale,
  BaseKit,
  Bold,
  BulletList,
  Indent,
  Italic,
  Link,
  OrderedList,
  Strike,
  Underline,
  History,
} from 'vuetify-pro-tiptap'
import 'vuetify-pro-tiptap/style.css'
import LinkDialogComponent from '../components/linkDialogComponent.vue'


export default function useTipTap() {

  const maximo = ref(2048) //Límite de palabras y caracteres

  //Configuración de idioma customizado
  locale.setMessage('spanish', {

    //Tooltips
    'editor.bold.tooltip': 'Negritas',
    'editor.italic.tooltip': 'Cursivas',
    'editor.underline.tooltip': 'Subrayado',
    'editor.strike.tooltip': 'Tachado',
    'editor.bulletlist.tooltip': 'Lista de viñetas',
    'editor.orderedlist.tooltip': 'Lista ordenada',
    'editor.link.tooltip': 'Enlace',
    'editor.link.dialog.title': 'Insertar enlace',
    'editor.link.dialog.link': 'Enlace',
    'editor.link.dialog.rel': 'Referencia',
    'editor.link.dialog.openInNewTab': 'Abrir en nueva pestaña',
    'editor.link.dialog.button.apply': 'Aplicar',
    'editor.link.open': 'Abrir enlace',
    'editor.link.unlink.tooltip': 'Quitar enlace',
    'editor.indent.tooltip': 'Aumentar sangría',
    'editor.outdent.tooltip': 'Reducir sangría',
    'editor.undo.tooltip': 'Deshacer',
    'editor.redo.tooltip': 'Rehacer',
    'editor.words': 'Palabras',
    'editor.characters': 'Caracteres',
  })
  locale.setLang('spanish')

  const extensions = [
    //Configuración de la extensión
    BaseKit.configure({
      //Placeholder del editor
      placeholder: {
        placeholder: 'Escribe algo...',
      },
      //Limites de palabras y caracteres
      characterCount: {
        limit: maximo.value ? maximo.value : 2048,
        countCharacters: true,
      },
    }),

    //Negritas, cursivas, subrayado, tachado, lista de viñetas, lista ordenada, enlace, sangría, historial (deshacer y rehacer)
    Bold,
    Italic,
    Underline,
    Strike,
    BulletList,
    OrderedList,
    Link.configure({
      dialogComponent: () => LinkDialogComponent //Componente personalizado para el diálogo de enlace pasado como función
    }),
    Indent,
    History,
  ]

  const content = ref('')


  return {
    extensions,
    content,
    maximo
  }
}

