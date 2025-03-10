export default [
    {
      path: "/list-instituciones",
      name: "listInstituciones",
      component: () => import("./views/ListInstitucionesView.vue"),
      meta: { title: "Instituciones" },
    },
  ];
  