export default [
    {
        path: "/visitas-campo",
        name: "visitasCampo",
        component: () => import("./views/ListVisitasCampoView.vue"),
        meta: { noSpace: true, title: "Visitas de campo" },
    },
    {
        path: "/crear-visita-campo",
        name: "crearVisitaCampo",
        component: () => import("./views/FormVisitaCampoView.vue"),
        meta: { title: "Creación de visita de campo" },
    },
    {
        path: "/editar-visita-campo/:id",
        name: "editarVisitaCampo",
        component: () => import("./views/FormVisitaCampoView.vue"),
        meta: { title: "Edición de visita de campo" },
    },
    {
        path: "/detalle-visita-campo/:id",
        name: "detalleVisitaCampo",
        component: () => import("./views/DetalleVisitaCampoView.vue"),
        meta: { title: "Detalle de visita de campo" },
    },
    {
        path: "/detalle-seguimiento/:id",
        name: "detalleSeguimiento",
        component: () => import("./views/DetalleSeguimientoView.vue"),
        meta: { title: "Detalle de seguimiento" },
    },
];