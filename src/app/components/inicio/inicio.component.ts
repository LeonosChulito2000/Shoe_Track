import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CarritoService } from '../../services/carrito.service';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  mostrarContenido = false;
  productos: any[] = [];
  productoSeleccionado: any = null;

  mostrarConfirmacion = false;


  tallaSeleccionada: string | null = null;
  colorSeleccionado: string | null = null;
  materialSeleccionado: string | null = null;


constructor(private http: HttpClient, private carritoService: CarritoService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.mostrarContenido = true;
      this.cargarProductos();
    }, 5500);
  }

  cargarProductos() {
    this.http.get<any[]>(`${environment.backendUrl}/obtener_productos.php`)
      .subscribe(data => {
        this.productos = data;
      });
  }

  verMas(producto: any) {
    this.productoSeleccionado = { ...producto };
    this.productoSeleccionado.tallasArray = producto.tallas.split(',').map((t: string) => t.trim());
    this.productoSeleccionado.coloresArray = producto.colores.split(',').map((c: string) => c.trim());
    this.productoSeleccionado.materialesArray = producto.material.split(',').map((m: string) => m.trim());


    this.tallaSeleccionada = null;
    this.colorSeleccionado = null;
    this.materialSeleccionado = null;


    // BLOQUEAR SCROLL al abrir modal
    document.body.style.overflow = 'hidden';
  }

  cerrarModal() {
    this.productoSeleccionado = null;
    this.tallaSeleccionada = null;
    this.colorSeleccionado = null;

    // DESBLOQUEAR SCROLL al cerrar modal
    document.body.style.overflow = 'auto';
  }

puedeAgregarAlCarrito(): boolean {
  return this.tallaSeleccionada !== null && this.colorSeleccionado !== null && this.materialSeleccionado !== null;
}

agregarAlCarrito() {
  if (this.puedeAgregarAlCarrito()) {
    this.carritoService.agregarProducto(
      this.productoSeleccionado,
      this.tallaSeleccionada!,
      this.colorSeleccionado!,
      this.materialSeleccionado!
    );
    this.mostrarConfirmacion = true;
  } else {
    alert('Por favor selecciona talla y color antes de agregar al carrito.');
  }
}

cerrarConfirmacion() {
  this.mostrarConfirmacion = false;
  this.cerrarModal();
}


}
