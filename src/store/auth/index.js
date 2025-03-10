// utilities
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

// services
import auth_service from '@/services/auth.services'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user_info_st: {},
        menu_st: [],
        paths_st: [],
    }),

    actions: {
        setAuthAct(payload) {
            const { token, refresh_token: refreshToken } = payload

            localStorage.setItem('token', token)
            localStorage.setItem('refresh_token', refreshToken)

            this.user_info_st = jwtDecode(token)
        },

        obtainInfoStorageAct() {
            const token = localStorage.getItem('token')
            if (token) {

                const decoded = jwtDecode(token)

                this.user_info_st = {...this.user_info_st, ...decoded}
            } else {
                this.user_info_st = {}
            }
        },

        async obtainUserInfoAct() {
            const { data, status } = await auth_service.verify();

            if (status !== 200) return

            this.user_info_st.user = data

        },

        async obtainPathsAct() {

            const FilterMenuFtn = (routes_param) => {
                return routes_param.filter((route) => {
                    if (!route.mostrar) return false
                    if (route.childrens?.length > 0) route.childrens = FilterMenuFtn(route.childrens)
                    return true
                })
            }

            const { data, status } = await auth_service.getAuthorizedPaths();

            if (status !== 200) return

            this.paths_st = JSON.parse(JSON.stringify(data));
            this.menu_st = FilterMenuFtn(data);
        },

        $reset() {
            localStorage.removeItem('token')
            localStorage.removeItem('refresh_token')
            this.user_info_st = {}
            this.menu_st = []
            this.paths_st = []
        }
    }
})
