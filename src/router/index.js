// utilities
import { createRouter, createWebHistory } from "vue-router";
import dayJS from "dayjs";
import { jwtDecode } from "jwt-decode";

// helpers
import { useUtils } from "../utils/config_router";
const { canNext, tempPassword } = useUtils();

// modules
import authRoutes from "../modules/auth/router";
import facturaRoutes from "../modules/facturas/router";
import aduanasRoutes from "../modules/aduanas/router";
import oficialesRoutes from "../modules/oficiales/router";
import clasesRoutes from "../modules/clases/router";
import institucionRoutes from "../modules/instituciones/router";
import firmaRoutes from "../modules/firmas/router";
import franquiciasRoutes from "../modules/franquicias/router";
import identicadorRoutes from "../modules/identificadores/router";
import usuarioRoutes from "../modules/usuarios/router";
import reporte from "../modules/reportes/router";
import rolesRoutes from "../modules/roles/router";
import visitasCampoRoutes from "../modules/visitas_campo/router";

const routes = [
  {
    path: "/",
    component: () => import("../layouts/DefaultLayout.vue"),
    children: [
      {
        path: "",
        name: "dashboard",
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ "../views/DashboardView.vue"
          ),

        meta: { title: "Dashboard" },
      },
      ...facturaRoutes,
      ...aduanasRoutes,
      ...oficialesRoutes,
      ...clasesRoutes,
      ...institucionRoutes,
      ...firmaRoutes,
      ...franquiciasRoutes,
      ...identicadorRoutes,
      ...usuarioRoutes,
      ...reporte,
      ...rolesRoutes,
      ...visitasCampoRoutes
    ],
  },
  ...authRoutes,

  {
    path: "/:pathMatch(.*)*",
    name: "forbidden",
    component: () => import("../views/ForbiddenView.vue"),
    meta: { requiresAuth: false, title: "Forbidden" },
  },
];

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL), // deprecated v4 to v6
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title || "Template";
  let token = null;
  let refresh_token = null;

  if (to.matched.some((record) => record.meta.requiresAuth !== false)) {
    token = localStorage.getItem("token");
    refresh_token = localStorage.getItem("refresh_token");
    if (!token) {
      next({ name: "login" });
      return;
    } else {
      const decoded = jwtDecode(token);
      const now = dayJS().unix();

      if (now > decoded.exp && !refresh_token) {
        next({ name: "login" });
        return;
      }
      const authorized = await canNext(to);
      const tempPwd = tempPassword(to, "changePasswordTemp");

      if (authorized && tempPwd) {
        next({ name: tempPwd });
        return;
      }
      if (authorized) {
        next(authorized);
      } else next({ name: "forbidden" });
    }
  } else {
    next();
  }
});

export default router;
