// utilities
import pinia from './pinia'
import router from '../router'
import vuetify from './vuetify'
import globalComponents from './autoimport'
// import { loadFonts } from './webfontloader'
import global_properties from '../utils/global_properties'

export function registerPlugins(app) {
  // loadFonts()
  global_properties.install(app)
  app
    .use(pinia)
    .use(router)
    .use(vuetify)
    .use(globalComponents)
 }
