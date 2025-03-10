export default [
  {
    path: "/list-clases",
    name: "listClases",
    component: () => import("./views/ListClasesView.vue"),
    meta: { title: "Clases" },
  },
];
