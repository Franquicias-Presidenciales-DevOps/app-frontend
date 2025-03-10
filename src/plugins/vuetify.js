import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createVuetify } from 'vuetify'
import { es } from "vuetify/locale";

const _default = {
  variant: 'outlined',
  density: 'comfortable',
  color: 'primary',
}

const light = {
  dark: false,
  colors: {
    background: '#F4F7FD',
    primary: '#1C1E4D',
    secondary: '#111C4E',
    text: '#111928',
    stroke: '#DFE4EA',
    background: '#FFFFFF',
    lightBlue: '#5475E5',
  }
}

const dark = {
  dark: true,
  colors: {
    background: '#F4F7FD',
    primary: '#1C1E4D',
    secondary: '#111C4E',
    text: '#111928',
    stroke: '#DFE4EA',
    background: '#000000',
    lightBlue: '#5475E5',
  }
}

export default createVuetify({
  // configuración de colores del tema
  // REF: https://vuetifyjs.com/en/features/theme/
  theme: {
    defaultTheme: 'light',
    themes: {
      light,
      dark,
    },
  },

  locale: {
    locale: 'es',
    messages: { es },
  },

  // configuración de valores por defecto de los componentes
  // REF: https://vuetifyjs.com/en/features/global-configuration/
  defaults: {
    VTextField: { ..._default },
    VSelect: { ..._default },
    VAutocomplete: { ..._default },
    VTextarea: { ..._default },
    VFileInput: { ..._default },
    VTabs: {
      VTab: {
        color: "primary",
        variant: "flat",
        rounded: "t-lg",
        hideSlider: true,
      }
    }
  }
})
