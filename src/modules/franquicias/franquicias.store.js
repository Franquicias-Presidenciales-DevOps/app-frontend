import { defineStore } from 'pinia'
import franquicia_service from '@/services/franquicias.services';

export const useFrancqStore = defineStore('franquicia', {
    state: () => ({
        franquicia: {},
        load_form: true,

        entidad: null,
        institucion: null,
        oficial: null,
        aduana: null,
        guia_aerea: null,
        embarque: null,
        mercaderia: null,
        carta_porte: null,
        dmti: null,
        fecha_franquicia: null,
        duca: null,
        tipo_factura: null,
        cantidad_bultos: null,
        clase: null,
        n_factura: null,
        contenido: null,
        destino: null,
        itinerario: null,
        nota: null,
        observacion: null,

        rating: {
            colaboracion_franquicia: 0,
            uso_franquicia: 0,
            manejo_documentacion: 0,
            beneficio_social: 0
        },

        fecha_importante: {
            reporte: null,
            entrega: null,
        }
    }),

    actions: {
        /** @description Resetea el store */
        ResetStoreAct() {
            this.franquicia = {};
            this.load_form = true;

            this.entidad = null;
            this.institucion = null;
            this.oficial = null;
            this.aduana = null;
            this.guia_aerea = null;
            this.embarque = null;
            this.mercaderia = null;
            this.carta_porte = null;
            this.dmti = null;
            this.fecha_franquicia = null;
            this.duca = null;
            this.tipo_factura = null;
            this.cantidad_bultos = null;
            this.clase = null;
            this.n_factura = null;
            this.contenido = null;
            this.destino = null;
            this.itinerario = null;
            this.nota = null;
            this.observacion = null;

            this.fecha_importante = {
                reporte: null,
                entrega: null,
            }
        },

        /**
         * @param {Number} id_franquicia
         * @description Obtiene la información de la franquicia
         */
        async FetchDataFranquiciaAct(id_franquicia) {
            try {
                const { data, status } = await franquicia_service.geFranquiciaById(id_franquicia);

                if (status === 200) {

                    this.franquicia = data;

                    this.entidad = data?.tipos?.id;
                    this.institucion = data?.institucion;
                    this.oficial = data?.oficial;
                    this.aduana = data.aduana;
                    this.guia_aerea = data.no_guia_aerea;
                    this.embarque = data.conoc_de_embarque_no;
                    this.mercaderia = data.inf_de_mercaderias_rec_no;
                    this.carta_porte = data.carta_de_porte_no;
                    this.dmti = data.nota_de_pedido_no;
                    this.fecha_franquicia = data.fecha
                    this.duca = data.duca;
                    this.tipo_factura = data.factura;
                    this.cantidad_bultos = data.bultos;
                    this.clase = data.clase;
                    this.n_factura = data.no_factura;
                    this.contenido = data.comentario;
                    this.destino = data.destino;
                    this.itinerario = data.itinerario;
                    this.nota = data.nota;
                    this.observacion = data.observacion;

                    this.fecha_importante.entrega = data?.fecha_entrega;
                    this.fecha_importante.reporte = data?.fecha_despacho;
                }
            } finally {
                this.load_form = false;
            }
        }
    }
})

