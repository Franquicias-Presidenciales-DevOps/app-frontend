export default [
    {
      path: "/list-identificadores-gestion",
      name: "listIdentificadoresGestion",
      component: () => import("./views/ListIdentificadoresView.vue"),
      meta: { title: "Identificadores de gestion" },
    },
  ];
  