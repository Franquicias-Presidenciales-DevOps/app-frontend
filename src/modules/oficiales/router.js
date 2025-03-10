export default [
    {
      path: "/list-oficiales",
      name: "listOficiales",
      component: () => import("./views/ListOficialesView.vue"),
      meta: { title: "Oficiales" },
    },
  ];
  