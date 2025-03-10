import { ref } from "vue";
import visitas_camposServices from "@/services/visitas_campos.services";
import { useRouter } from "vue-router";

import { useVistCampStore } from '../store';
import { useUtilsStore } from "@/store/utils";

export function useDetallesSeguimiento() {

  const numeroSeguimiento = ref(null);
  const entidadNombre = ref(null);
  const codigoFranquicia = ref(null);
  const totalReportes = ref(null);
  const totalConObs = ref(null);
  const totalSinObs = ref(null);
  const lastReporte = ref(null);
  const firstReporte = ref(null);
  const reportesArray = ref([]);
  const ruta = useRouter();

  const store_ref = useVistCampStore(); // store

  async function getDetallesSeguimiento(id) {

    store_ref.seguimientoId = null;
    store_ref.seguimientoFlag = false;

    const { data, status } = await visitas_camposServices.getDetallesSeguimiento(id);

    if (status === 200) {
      numeroSeguimiento.value = data.numero_seguimiento;
      entidadNombre.value = data.entidad;
      codigoFranquicia.value = data.codigo_franquicia;
      totalReportes.value = data.totales.total_reportes;
      totalConObs.value = data.totales.total_con_observaciones;
      totalSinObs.value = data.totales.total_sin_observaciones;

      data.reportes.forEach((reporte, index) => {

        const report = {
          id: reporte.id,
          franquicia: reporte.franquicia,
          fecha: reporte.fecha_visita,
          detalle: reporte.detalle,
          categoria: reporte.categoria_visita,
          numero_seguimiento: reporte.numero_seguimiento,
        }

        reportesArray.value.push(report);
      });
    }

    firstReporte.value = reportesArray.value[0];
    lastReporte.value = reportesArray.value[reportesArray.value.length - 1];

  }

  async function printAllReports(franquicia_id) {

    const { data, status } = await visitas_camposServices.generarReportesFranquicia(franquicia_id);

    if (status == 200) {
      const blob = new Blob([data], { type: "application/pdf" });

      const url = URL.createObjectURL(blob);

      const newWindow = window.open(url, "_blank");
    }

  }

  async function printReport(id) {

    const { data, status } = await visitas_camposServices.getReporteById(id);

    if (status === 200) {
      const blob = new Blob([data], { type: "application/pdf" });

      const url = URL.createObjectURL(blob);

      const newWindow = window.open(url, "_blank");
    }

  }

  function backToListView() {
    store_ref.entidad_seguimiento = null;
    store_ref.franquicia_seguimiento = null;
    ruta.push("/visitas-campo");
  }

  function goToDetails(id) {
    store_ref.seguimientoFlag = true;
    store_ref.seguimientoId = ruta.currentRoute._value.params.id;
    ruta.push(`/detalle-visita-campo/${id}`);
  }

  function addReportFn() {
    store_ref.entidad_seguimiento = entidadNombre.value;
    store_ref.franquicia_seguimiento = codigoFranquicia.value;
    store_ref.addReportFlag = true;

    ruta.push("/crear-visita-campo");
  }

  return {
    numeroSeguimiento,
    entidadNombre,
    codigoFranquicia,
    totalReportes,
    totalConObs,
    totalSinObs,
    reportesArray,
    firstReporte,
    lastReporte,
    ruta,
    store_ref,
    addReportFn,
    getDetallesSeguimiento,
    printAllReports,
    printReport,
    backToListView,
    goToDetails,
  }

}
