import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import Chart from 'chart.js/auto';
// Para PDF
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
// Para ExcelJS y file-saver
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// Definición de la interfaz para las ventas
interface Venta {
  id: number;
  numero_venta: number;
  productos: string;
  precio_total: number;
  fecha_venta: string;
  id_cliente: string;
  editing?: boolean;
  [key: string]: any;
}

// Interfaz actualizada para la respuesta del reporte
interface ReporteResponse {
  header: {
    appName: string;
    period: string;
    generatedDate: string;
    logo: string;
  };
  charts: {
    salesComparison: {
      current: { period: string; totalVentas: number }[];
      previous: { period: string; totalVentas: number }[];
    };
    totalSales: {
      current: { period: string; totalSalesValue: number }[];
      previous: { period: string; totalSalesValue: number }[];
    };
    accumulatedRevenue: { period: string; cumulativeRevenue: number }[];
    revenueComparison: {
      current: { period: string; cumulativeRevenue: number }[];
      previous: { period: string; cumulativeRevenue: number }[];
    };
    topClients: { id_cliente: string; totalVentas: number; totalComprado: number }[];
  };
}

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  // Lista de ventas y filtro de búsqueda
  ventasList: Venta[] = [];
  searchTerm: string = '';

  // Variables utilizadas para la generación del reporte en el modal
  showReportModal: boolean = false;
  reportGenerated: boolean = false;
  noData: boolean = false;
  reportType: string = 'day'; // Puede ser 'day' o 'month'
  startDate: string = '';
  endDate: string = '';
  selectedMonth: string = '';

  // Variables para el proceso de eliminación
  showDeleteModal: boolean = false;
  saleToDelete: Venta | null = null;
  message: string = '';

  // Variable para almacenar el encabezado del reporte (header)
  reportHeader: ReporteResponse['header'] | null = null;

  //Variable para la creación de pdf
  isGeneratingPDF: boolean=false; //Estado de carga del bolean

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadVentas();
  }

  // Método para obtener la lista de ventas desde el backend
  loadVentas(): void {
    this.http.get<Venta[]>(`${environment.backendUrl}/ventas.php`).subscribe(
      data => {
        this.ventasList = data;
      },
      error => {
        console.error("Error al cargar ventas", error);
      }
    );
  }

  // Filtro para la lista de ventas basado en el término de búsqueda
  get filteredVentasList(): Venta[] {
    if (!this.searchTerm) {
      return this.ventasList;
    }
    const term = this.searchTerm.toLowerCase();
    return this.ventasList.filter(sale =>
      sale.numero_venta.toString().toLowerCase().includes(term) ||
      sale.productos.toLowerCase().includes(term) ||
      sale.precio_total.toString().toLowerCase().includes(term) ||
      sale.fecha_venta.toLowerCase().includes(term) ||
      sale.id_cliente.toString().toLowerCase().includes(term)
    );
  }

  // Abre el modal para generar el reporte
  openReportModal(): void {
    this.showReportModal = true;
    this.reportGenerated = false; // Reiniciamos para cuando se abra el modal nuevamente
    this.noData = false;

    // Opcional: Limpiar los campos de fecha/mes al abrir el modal
    this.startDate = '';
    this.endDate = '';
    this.selectedMonth = '';
  }

  // Cierra el modal (enlaza este método al botón "Cerrar" de tu HTML)
  closeModal(): void {
    this.showReportModal = false;
  }

  // Genera el reporte sin cerrar el modal, dejando los resultados en la parte inferior
  generateReport(): void {
    // Mantener el modal abierto y mostrar la sección de gráficos
    this.reportGenerated = true;

    // Crear objeto params basado en el tipo de reporte seleccionado
    let params: { [param: string]: string } = {};
    if (this.reportType === 'day') {
      params = { type: 'day', start: this.startDate, end: this.endDate };
    } else {
      params = { type: 'month', month: this.selectedMonth };
    }

    // Solicitar datos para el reporte al endpoint PHP
    this.http.get<ReporteResponse>(`${environment.backendUrl}/reportes.php`, { params: params })
  .subscribe(
    (response: ReporteResponse) => {
      console.log("Respuesta del reporte:", response); // Este log debería aparecer
      this.reportHeader = response.header;
      if (
          response.charts.salesComparison.current.length === 0 &&
          response.charts.totalSales.current.length === 0 &&
          response.charts.accumulatedRevenue.length === 0 &&
          response.charts.topClients.length === 0
      ) {
        this.noData = true;
      } else {
        setTimeout(() => {
          this.createCharts(response.charts);
          console.log("Datos de top clients:", response.charts.topClients);
        }, 0);
      }
    },
    error => {
      console.error("Error al generar el reporte", error);
    }
  );
  }

  // Crea las gráficas utilizando Chart.js
  createCharts(chartsData: ReporteResponse['charts']): void {
    // Gráfica 1: Comparación de Ventas
    const salesChartCtx = document.getElementById('salesChart') as HTMLCanvasElement;
    if (salesChartCtx) {
      const labelsSales = chartsData.salesComparison.current.map(item => item.period);
      const currentSales = chartsData.salesComparison.current.map(item => item.totalVentas);
      const previousSales = chartsData.salesComparison.previous.map(item => item.totalVentas);
      new Chart(salesChartCtx, {
        type: 'line',
        data: {
          labels: labelsSales,
          datasets: [
            {
              label: 'Ventas Actuales',
              data: currentSales,
              borderColor: 'blue',
              fill: false
            },
            {
              label: 'Ventas Per. Anterior',
              data: previousSales,
              borderColor: 'orange',
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          plugins: { title: { display: true, text: 'Comparación de Ventas' } }
        }
      });
    } else {
      console.error("No se encontró el elemento 'salesChart'");
    }

    // Gráfica 2: Comparación de Ingresos Totales
    const revenueChartCtx = document.getElementById('revenueChart') as HTMLCanvasElement;
    if (revenueChartCtx) {
      const labelsRevenue = chartsData.totalSales.current.map(item => item.period);
      const currentRevenue = chartsData.totalSales.current.map(item => item.totalSalesValue);
      const previousRevenue = chartsData.totalSales.previous.map(item => item.totalSalesValue);
      new Chart(revenueChartCtx, {
        type: 'bar',
        data: {
          labels: labelsRevenue,
          datasets: [
            {
              label: 'Ingresos Actuales',
              data: currentRevenue,
              backgroundColor: 'green'
            },
            {
              label: 'Ingresos Per. Anterior',
              data: previousRevenue,
              backgroundColor: 'red'
            }
          ]
        },
        options: {
          responsive: true,
          plugins: { title: { display: true, text: 'Comparación de Ingresos Totales' } }
        }
      });
    } else {
      console.error("No se encontró el elemento 'revenueChart'");
    }

    // Gráfica 3: Top 5 Clientes
    console.log("Datos de topClients:", chartsData.topClients);
    console.log("Datos de topClients:", chartsData.topClients);
chartsData.topClients.forEach(client => {
  console.log(`Cliente ${client.id_cliente} - Ventas:`, client.totalVentas, "Tipo:", typeof client.totalVentas);
});


const topClientsCtx = document.getElementById('topClientsChart') as HTMLCanvasElement;
if (topClientsCtx) {
  const clientLabels = chartsData.topClients.map(item => item.id_cliente);
  const clientPurchases = chartsData.topClients.map(item => Number(item.totalComprado)); 
  const clientSales = chartsData.topClients.map((item: any) => Number(item.ventas));

  new Chart(topClientsCtx, {
    type: 'bar',
    data: {
      labels: clientLabels,
      datasets: [{
        label: 'Total Comprado',
        data: clientPurchases,
        backgroundColor: 'purple'
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        title: { display: true, text: 'Top 5 Clientes - Total Comprado' },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = 'Total Comprado: ';
              if (context.parsed.x !== null) {
                label += '$' + context.parsed.x.toFixed(2);
              }
              let index = context.dataIndex; // Índice de la barra actual
              let salesCount = clientSales[index]; // Obtiene el número de ventas correspondiente
              label += ` | Ventas: ${salesCount}`; // Agrega la cantidad de ventas al tooltip
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Total Comprado ($)' }
        }
      }
    }
  });
} else {
  console.error("No se encontró el elemento 'topClientsChart'");
}




    // Gráfica 4: Ingresos Acumulados
    const accumulatedRevenueCtx = document.getElementById('accumulatedRevenueChart') as HTMLCanvasElement;
    if (accumulatedRevenueCtx) {
      const labelsAccumulated = chartsData.accumulatedRevenue.map(item => item.period);
      const cumulativeRevenue = chartsData.accumulatedRevenue.map(item => item.cumulativeRevenue);
      new Chart(accumulatedRevenueCtx, {
        type: 'line',
        data: {
          labels: labelsAccumulated,
          datasets: [{
            label: 'Ingresos Acumulados',
            data: cumulativeRevenue,
            borderColor: 'purple',
            fill: false
          }]
        },
        options: {
          responsive: true,
          plugins: { title: { display: true, text: 'Ingresos Acumulados' } }
        }
      });
    } else {
      console.error("No se encontró el elemento 'accumulatedRevenueChart'");
    }

    // Gráfica 5: Comparación Acumulada de Ingresos
    const revenueComparisonCtx = document.getElementById('revenueComparisonChart') as HTMLCanvasElement;
    if (revenueComparisonCtx) {
      const labelsComparison = chartsData.revenueComparison.current.map(item => item.period);
      const currentComparison = chartsData.revenueComparison.current.map(item => item.cumulativeRevenue);
      const previousComparison = chartsData.revenueComparison.previous.map(item => item.cumulativeRevenue);
      new Chart(revenueComparisonCtx, {
        type: 'bar',
        data: {
          labels: labelsComparison,
          datasets: [
            { label: 'Acumulado Actual', data: currentComparison, backgroundColor: 'blue' },
            { label: 'Acumulado Per. Anterior', data: previousComparison, backgroundColor: 'orange' }
          ]
        },
        options: {
          responsive: true,
          plugins: { title: { display: true, text: 'Comparación Acumulada de Ingresos' } }
        }
      });
    } else {
      console.error("No se encontró el elemento 'revenueComparisonChart'");
    }
  }

  // Funcionalidad para exportar el reporte a PDF
exportPDF(): void {
  this.isGeneratingPDF = true; // Mostrar el modal de carga

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  let currentY = 10;

  // 1️⃣ Capturar el encabezado del reporte
  const headerElement = document.querySelector('.report-result-header');
  if (!headerElement || !(headerElement instanceof HTMLElement)) {
    console.error('No se encontró el encabezado del reporte.');
    this.isGeneratingPDF = false;
    return;
  }

  html2canvas(headerElement as HTMLElement, {
    scale: 2,
    backgroundColor: '#fff',
    useCORS: true,
    ignoreElements: (element) => {
      return element.tagName.toLowerCase() === 'link' && element.getAttribute('rel') === 'shortcut icon';
    }
  }).then(headerCanvas => {
    const headerImgData = headerCanvas.toDataURL('image/png');
    const headerHeight = (headerCanvas.height * pdfWidth) / headerCanvas.width;
    pdf.addImage(headerImgData, 'PNG', 0, currentY, pdfWidth, headerHeight);
    currentY += headerHeight + 10;

    // 2️⃣ Capturar cada gráfica de la sección .charts-container
    const canvasList = Array.from(document.querySelectorAll('.charts-container canvas'))
      .filter((canvas, index, self) => index === self.findIndex(c => c.id && c.id === canvas.id));

    let promiseChain = Promise.resolve();
    canvasList.forEach((canvas) => {
      if (canvas instanceof HTMLCanvasElement) { // Verificamos su tipo
        promiseChain = promiseChain.then(() => html2canvas(canvas, { scale: 2, backgroundColor: '#fff', useCORS: true }))
          .then(canvasImg => {
            const imgData = canvasImg.toDataURL('image/png');
            const imgHeight = (canvasImg.height * pdfWidth) / canvasImg.width;
            if (currentY + imgHeight > pdf.internal.pageSize.getHeight()) {
              pdf.addPage();
              currentY = 10;
            }
            pdf.addImage(imgData, 'PNG', 0, currentY, pdfWidth, imgHeight);
            currentY += imgHeight + 10;
          });
      } else {
        console.error("Elemento no es un HTMLCanvasElement:", canvas);
      }
    });

    promiseChain.then(() => {
      // 3️⃣ Generar el nombre del archivo PDF con la fecha del reporte
      let formattedDate = "Reporte_Fecha_Desconocida";
      if (this.reportHeader && this.reportHeader.period) {
        formattedDate = this.reportHeader.period.toString().replace(/[^0-9A-Za-z_-]/g, '_');
      }

      pdf.save(`Reporte_${formattedDate}.pdf`);
      this.isGeneratingPDF = false; // Ocultar el modal al terminar
    });
  }).catch(error => {
    console.error('Error al generar el PDF:', error);
    this.isGeneratingPDF = false;
  });
}







  // Exportar a Excel: Datos filtrados y gráficos en hojas separadas
  async exportExcelWithCharts(): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    // Hoja para datos filtrados
    const wsData = workbook.addWorksheet('Reporte de Ventas');
    const headers = ["Venta", "Productos", "Precio Total", "Fecha", "Cliente"];
    wsData.addRow(headers);
    this.filteredVentasList.forEach((sale: Venta) => {
      wsData.addRow([
        sale.numero_venta,
        sale.productos,
        sale.precio_total,
        sale.fecha_venta,
        sale.id_cliente
      ]);
    });

    // Hoja(s) para las gráficas: se buscan los canvas de las gráficas
    const chartCanvasElements = document.querySelectorAll('.charts-container canvas') as NodeListOf<HTMLCanvasElement>;
    chartCanvasElements.forEach((canvas, index) => {
      const imgData = canvas.toDataURL('image/png');
      const base64Str = imgData.replace(/^data:image\/png;base64,/, "");
      const imageBuffer = Uint8Array.from(atob(base64Str), c => c.charCodeAt(0));
      const imageId = workbook.addImage({
        buffer: imageBuffer,
        extension: 'png'
      });
      const sheetName = `Grafica ${index + 1}`;
      const wsChart = workbook.addWorksheet(sheetName);
      wsChart.insertRow(1, [sheetName]);
      wsChart.addImage(imageId, {
        tl: { col: 0, row: 1 },
        ext: { width: 500, height: 300 }
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'reporte.xlsx');
  }

  // Método del template para Excel
  exportExcel(): void {
    this.exportExcelWithCharts();
  }

  // Funcionalidad para confirmar la eliminación de una venta
  confirmDelete(sale: Venta): void {
    this.saleToDelete = sale;
    this.showDeleteModal = true;
  }

  // Eliminar la venta seleccionada
  deleteSale(): void {
    if (this.saleToDelete) {
      this.http.delete(`${environment.backendUrl}/ventas.php?id=${this.saleToDelete.id}`)
        .subscribe(
          response => {
            this.showDeleteModal = false;
            this.loadVentas();
          },
          error => {
            console.error("Error al eliminar la venta", error);
          }
        );
    }
  }

  // Cancelar la eliminación
  cancelDelete(): void {
    this.showDeleteModal = false;
    this.saleToDelete = null;
  }
}