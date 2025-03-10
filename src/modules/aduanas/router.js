export default [
    {
        path: '/list-aduanas',
        name: 'listAduanas',
        component: () => import(/* webpackChunkName: "listAduana" */ './views/ListAduanasView.vue'),
        meta: { title: "Listado de aduanas" },
    },
]