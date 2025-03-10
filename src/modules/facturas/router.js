export default [
  {
    // path: "/list-facturas",
    path: "/list-tipo-franquicias",
    name: "listFacturas",
    component: () => import("./views/ListFacturasView.vue"),
    // meta: { title: "Facturas" },
    meta: { title: "Tipo de franquicias" },
  },
];
