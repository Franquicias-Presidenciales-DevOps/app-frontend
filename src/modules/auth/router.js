export default [
  {
    path: "/",
    component: () => import("./layouts/AuthLayout.vue"),
    children: [
      {
        path: "/login",
        name: "login",
        component: () =>
          import(/* webpackChunkName: "login" */ "./views/LoginView.vue"),
        meta: { requiresAuth: false, title: "Login" },
      },

      {
        path: "/recuperar-password",
        name: "recuperar-password",
        component: () =>
          import(
            /* webpackChunkName: "recuperarPassword" */ "./views/RecoveryPasswordView.vue"
          ),
        meta: { requiresAuth: false, title: "Recuperar contraseña" },
      },
    ],
    meta: { requiresAuth: false },
  },

  {
    path: "/",
    component: () => import("../../layouts/DefaultLayout.vue"),
    children: [
      {
        path: "/change-password",
        name: "changePassword",
        component: () => import("./views/ChangePasswoardView.vue"),
        meta: { title: "Cambiar contraseña" },
      },
    ],
  },

  {
    path: "/change-password",
    name: "changePasswordTemp",
    component: () => import("./views/ChangePasswoardView.vue"),
    meta: { title: "Cambiar contraseña temporal" },
  }, 
];
