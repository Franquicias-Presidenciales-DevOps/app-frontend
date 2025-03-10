import { defineStore } from 'pinia'
// import franquicia_service from '@/services/franquicias.services';

export const useVistCampStore = defineStore('visita_campo', {
  state: () => ({
    filter_s_g: {
      entidad: null,
      n_franquicia: null,
      n_seguimiento: null,
      fecha_inicio: null,
      fecha_fin: null,
    },

    enable_filter_s_g: false,

    filter_s_f: {
      entidad: null,
      n_franquicia: null,
      n_seguimiento: null,
    },

    enable_filter_s_f: false,

    entidad_seguimiento: null, //Entidad de seguimiento para agregarle reportes
    franquicia_seguimiento: null, //Franquicia de seguimiento para agregarle reportes
    hasEntidad: false, //Boolean para saber si hay entidad
    hasFranquicia: false, //Boolean para saber si hay franquicia
    addReportFlag: false, //Boolean para saber si viene de agregar reporte
    seguimientoFlag: false, //Boolean para saber si viene de seguimiento
    seguimientoId: null, //Id del seguimiento

  }),

  actions: {
    ResetListVistCampAc() {
      this.filter_s_g = {
        entidad: null,
        n_franquicia: null,
        n_seguimiento: null,
        fecha_inicio: null,
        fecha_fin: null,
      }

      this.enable_filter_s_g = false

      this.filter_s_f = {
        entidad: null,
        n_franquicia: null,
        n_seguimiento: null,
      }

      this.enable_filter_s_f = false
    }
  },

  getters: {

    checkEntidad() {

      if (this.entidad_seguimiento !== null) {
        this.hasEntidad = true;
      }
      else {
        this.hasEntidad = false;
      }

      return this.hasEntidad;
    },

    checkFranquicia() {

      if (this.franquicia_seguimiento !== null) {
        this.hasFranquicia = true;
      }
      else {
        this.hasFranquicia = false;
      }

      return this.hasFranquicia;
    },

  }


});
