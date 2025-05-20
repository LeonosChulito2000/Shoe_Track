import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';


@Component({
  selector: 'app-carrito-de-compras',
  templateUrl: './carrito-de-compras.component.html',
  styleUrls: ['./carrito-de-compras.component.css']
})
export class CarritoDeComprasComponent implements OnInit {
  carrito: any[] = [];

constructor(private carritoService: CarritoService, private router: Router) {}

  ngOnInit(): void {
      window.scrollTo(0, 0); // Asegura que al entrar a la página, esté arriba

  this.carritoService.carrito$.subscribe(data => {
    this.carrito = data;
  });
}

  procederCompra() {
    this.router.navigate(['/Usuario-de-Compra']);
  }




  aumentar(item: any) {
  this.carritoService.aumentarCantidad(item);
}

disminuir(item: any) {
  this.carritoService.disminuirCantidad(item);
}

eliminar(item: any) {
  this.carritoService.eliminarProducto(item);
}

get totalProductos(): number {
  return this.carritoService.obtenerCantidadTotal();
}

get totalPrecio(): number {
  return this.carritoService.obtenerTotal();
}

}
