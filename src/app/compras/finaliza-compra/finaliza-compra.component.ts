import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-finaliza-compra',
  templateUrl: './finaliza-compra.component.html',
  styleUrls: ['./finaliza-compra.component.css']
})
export class FinalizaCompraComponent implements OnInit {
  carrito: any[] = [];
  usuario: any;
  total: number = 0;
  mostrarModal: boolean = false;
  fechaEntrega: string = '';
  numeroPedido: string = '';  // <-- variable para guardar el id pedido


  constructor(
    private carritoService: CarritoService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.carrito = this.carritoService.obtenerCarrito();
    this.total = this.carritoService.obtenerTotal();
    const usuarioData = localStorage.getItem('datosUsuario');
    if (usuarioData) {
      this.usuario = JSON.parse(usuarioData);
    } else {
      this.router.navigate(['/Usuario-de-Compra']);
    }

    const fechaActual = new Date();
    fechaActual.setDate(fechaActual.getDate() + 2);
    this.fechaEntrega = fechaActual.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  agregarCantidad(item: any) {
    item.cantidad++;
    this.total = this.carritoService.obtenerTotal();
  }

  disminuirCantidad(item: any) {
    if (item.cantidad > 1) {
      item.cantidad--;
    } else {
      this.eliminarItem(item);
    }
    this.total = this.carritoService.obtenerTotal();
  }

  eliminarItem(item: any) {
    this.carrito = this.carrito.filter(p => p !== item);
    this.carritoService.actualizarCarrito(this.carrito);
    this.total = this.carritoService.obtenerTotal();
  }

  finalizarCompra() {
    const backendUrl = environment.backendUrl;

    const pedidoPayload = {
      correo: this.usuario.correo,  // Mando el correo en vez del id_cliente
      productos: this.carrito.map(item => ({
        sku: item.sku,
        color: item.color,
        material: item.material,
        talla: item.talla,
        cantidad: item.cantidad,
        precio: item.precio
      }))
    };

    // Paso 1: Enviar el pedido al backend
    this.http.post(`${backendUrl}/guardarPedido.php`, pedidoPayload).toPromise()
      .then((res: any) => {
        if (res.success) {
          this.numeroPedido = res.id_pedido;  // guardamos el número de pedido aquí

          // Paso 2: Actualizar stock y contador de pedidos
          const solicitudes = this.carrito.map(item =>
            this.http.post(`${backendUrl}/actualizar_stock.php`, {
              sku: item.sku,
              cantidad: item.cantidad
            }).toPromise()
          );

          solicitudes.push(
            this.http.post(`${backendUrl}/incrementar_pedidos.php`, {
              correo: this.usuario.correo
            }).toPromise()
          );

          return Promise.all(solicitudes);
        } else {
          throw new Error("Error al guardar el pedido: " + res.error);
        }
      })
      .then(() => {
        // Paso 3: Mostrar modal y redirigir
        this.mostrarModal = true;
        setTimeout(() => {
          this.carritoService.vaciarCarrito();
          this.router.navigate(['/inicio']);
        }, 10000);
      })
      .catch(error => {
        console.error("Error en el proceso de compra:", error);
        alert("Ocurrió un error al procesar tu compra.");
      });
  }

  cerrarModal() {
    this.mostrarModal = false;
  }
}
