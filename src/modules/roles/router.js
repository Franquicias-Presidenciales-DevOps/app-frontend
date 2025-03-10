export default [
  {
    path: "/list-roles",
    name: "listRoles",
    component: () => import("./views/ListRolesView.vue"),
    meta: { title: "Roles" },
  },
  {
    path: "/agregar-rol",
    name: "agregarRol",
    component: () => import(/* webpackChunkName: "agregarRol" */"./views/RolesAddEdit.vue"),
    meta: { requiresAuth: true, title: "Agregar Rol" }
  },
  {
    path: "/editar-rol/:id",
    name: "editarRol",
    component: () => import("./views/RolesAddEdit.vue"),
    meta: { requiresAuth: true, title: "Editar Rol" }
  }
];
