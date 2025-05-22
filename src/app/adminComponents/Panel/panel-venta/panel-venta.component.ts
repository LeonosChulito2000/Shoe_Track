import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-panel-venta',
  templateUrl: './panel-venta.component.html',
  styleUrls: ['./panel-venta.component.css'] // Corregido: era `styleUrl`, debe ser `styleUrls`
})
export class PanelVentaComponent {
  barcode = '';
  productos: any[] = [];
  mostrarSinStock = false;
  modalCobro = false;
  solicitarIdCliente = false;
  mensajeRegistro = false;
  correoCliente = '';
  mostrarVentaFinalizada = false;
  clienteNoExiste = false;
  idCliente: number | null = null;
  errorCorreo = '';



  @ViewChild('skuInput') skuInput!: ElementRef;

  constructor(private http: HttpClient) {}

  buscarProducto() {
    if (!this.barcode) return;

    const url = `${environment.backendUrl}/obtener_producto.php?codigo_barras=${this.barcode}`;
    this.http.get<any>(url).subscribe(res => {
      if (res.error || res.stock <= 0) {
        this.mostrarSinStock = true;
      } else {
        const existente = this.productos.find(p => p.codigo_barras === res.codigo_barras);
        if (existente) {
          this.incrementarCantidad(existente);
        } else {
          res.cantidad = 1;
          this.productos.push(res);
        }
      }
      this.resetInput();
    });
  }
mostrarConfirmacionCancelacion = false;

confirmarCancelarCompra() {
  this.productos = [];
  this.mostrarConfirmacionCancelacion = false;
  this.resetInput();
}

  resetInput() {
    this.barcode = '';
    setTimeout(() => this.skuInput.nativeElement.focus(), 0);
  }

  incrementarCantidad(producto: any) {
    producto.cantidad++;
  }

  decrementarCantidad(producto: any) {
    if (producto.cantidad > 1) {
      producto.cantidad--;
    } else {
      this.eliminarProducto(producto);
    }
  }

  eliminarProducto(producto: any) {
    this.productos = this.productos.filter(p => p.codigo_barras !== producto.codigo_barras);
  }

  get totalCantidad() {
    return this.productos.reduce((acc, p) => acc + p.cantidad, 0);
  }

  get totalPrecio() {
    return this.productos.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
  }

  formatPrecio(valor: number): string {
    return '$' + valor.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  cerrarModalSinStock() {
    this.mostrarSinStock = false;
    this.resetInput();
  }

  cancelarCompra() {
      this.mostrarConfirmacionCancelacion = true;
  }

  
  abrirModalCobro() {
    this.modalCobro = true;
  }

clienteTieneCuenta(tiene: boolean) {
  if (tiene) {
    this.solicitarIdCliente = true;
    this.clienteNoExiste = false;
  } else {
    this.idCliente = 0; // Cliente anónimo
    this.continuarVenta(); // Continúa directamente con la venta
  }
}



  limpiarVenta() {
  this.productos = [];
  this.barcode = '';
  this.resetInput();
}

finalizarVenta() {
  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.correoCliente);

  // Validar formato de correo
  if (!correoValido) {
    this.errorCorreo = 'Escribe un correo válido';
    this.clienteNoExiste = false; // limpiar otros errores
    return;
  }

  if (this.correoCliente) {
    // Verificar si el correo existe
    this.http.get<any>(`${environment.backendUrl}/verificar_cliente.php?correo=${this.correoCliente}`)
      .subscribe(res => {
        if (res.existe) {
          this.idCliente = res.id_cliente;
          this.errorCorreo = '';
          this.clienteNoExiste = false;
          this.continuarVenta();
        } else {
          this.idCliente = null;
          this.errorCorreo = '';
          this.clienteNoExiste = true;
        }
      });
  } else {
    // Si no se requiere cliente (cliente anónimo)
    this.errorCorreo = '';
    this.clienteNoExiste = false;
    this.continuarVenta();
  }
}

continuarVenta() {
const venta = {
  numero_venta: 'V' + new Date().getTime(),
  productos: this.productos.map(p => p.codigo_barras),
  precio_total: this.totalPrecio,
  id_cliente: this.idCliente // Usa el ID si existe
};

  if (venta.id_cliente) {
    this.http.post(`${environment.backendUrl}/incrementar_pedidos.php`, { correo: this.correoCliente }).subscribe();
  }

  this.http.post(`${environment.backendUrl}/registrar_venta.php`, venta).subscribe(() => {
    this.modalCobro = false;
    this.solicitarIdCliente = false;
    this.mensajeRegistro = false;
    this.correoCliente = '';
    this.clienteNoExiste = false;

    this.mostrarVentaFinalizada = true;
    this.limpiarVenta();

    setTimeout(() => {
      this.mostrarVentaFinalizada = false;
    }, 2000);
  });
}


}
