// Utilities
import { defineStore } from 'pinia'
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export const useUtilsStore = defineStore('utils', {
    state: () => ({
        loader_st: false,
        side_bar_st: true,
    }),

    actions: {
        /**
         * @description Muestra una alerta en pantalla
         * @param {Object} payload
         * @param {String} payload.type - tipo de alerta
         * @param {String} payload.message - mensaje a mostrar
         * @param {Number} payload.timeout - tiempo de duración de la alerta
         */
        setNotification(payload) {
            toast[payload?.type](payload?.message, {
                timeout: payload?.timeout ?? 1000,
                position: 'top-right',
                pauseOnHover: true,
                icon: true,
                containerClassName: 'custom-toast',
                theme: 'colored',
                hideProgressBar: true,
            });
        },

        $reset() {
            this.loader_st = false
            this.side_bar_st = true
        }
    }
})
