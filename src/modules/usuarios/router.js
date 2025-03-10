export default [
    {
      path: "/list-usuarios",
      name: "listUsuarios",
      component: () => import("./views/ListUsuariosView.vue"),
      meta: { title: "Usuarios" },
    },
  ];
  