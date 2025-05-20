import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-estado-de-pedido',
  templateUrl: './estado-de-pedido.component.html',
  styleUrls: ['./estado-de-pedido.component.css']
})
export class EstadoDePedidoComponent {

  idPedidoInput = '';
  pedidoCargado = false;
  productos: any[] = [];
  cliente: any = null;
  estado: string = '';
  idPedido: string = '';
  mensajeError = '';
  fechaCompra = '';
  fechaEntrega = '';


  constructor(private http: HttpClient) {}

  consultarPedido() {
    if (!this.idPedidoInput) return;

    this.http.post<any>(`${environment.backendUrl}/estado_pedido.php`, {
      id_pedido: this.idPedidoInput
    }).subscribe(response => {
      if (response.success) {
        this.pedidoCargado = true;
        this.productos = response.productos;
        this.cliente = response.cliente;
        this.estado = response.estado;
        this.idPedido = response.id_pedido;
        this.fechaCompra = response.fecha_compra;
        this.fechaEntrega = response.fecha_entrega;

      } else {
        this.mensajeError = response.message;
        this.pedidoCargado = false;
              setTimeout(() => {
        this.mensajeError = '';
      }, 5000);

      }
    });
  }

  getColorEstado(): string {
    return {
      'preparacion': '#ffffff',
      'enviado': '#ffcc00',
      'entregado': '#00cc66'
    }[this.estado] || '#ffffff';
  }
}
