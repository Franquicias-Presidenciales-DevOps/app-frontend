export default [
    {
        path: '/list-franquicias',
        name: 'listFranquicias',
        component: () => import(/* webpackChunkName: "listFranquicias" */ './views/ListFranquiciasView.vue'),
        meta: { title: "Listado de franquicias" },
    },
    {
        path: '/crear-franquicia',
        name: 'crearFranquicia',
        component: () => import(/* webpackChunkName: "crearFranquicia" */ './views/FormFranquiciasView.vue'),
        meta: { title: "Crear franquicia" },
    },
    {
        path: '/editar-franquicia/:id',
        name: 'editarFranquicia',
        component: () => import(/* webpackChunkName: "editarFranquicia" */ './views/FormFranquiciasView.vue'),
        meta: { title: "Editar franquicia" },
    },
    {
        path: '/ver-franquicia/:id',
        name: 'verFranquicia',
        component: () => import(/* webpackChunkName: "verFranquicia" */ './views/FormFranquiciasView.vue'),
        meta: { title: "Ver franquicia" },
    }
]