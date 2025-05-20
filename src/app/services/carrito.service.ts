import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito: any[] = [];
  private carritoSubject = new BehaviorSubject<any[]>([]);
  private totalItemsSubject = new BehaviorSubject<number>(0);

  carrito$ = this.carritoSubject.asObservable();
  totalItems$ = this.totalItemsSubject.asObservable();

  constructor() {}

agregarProducto(producto: any, talla: string, color: string, material: string) {
  const existente = this.carrito.find(item =>
    item.sku === producto.codigo_barras &&
    item.talla === talla &&
    item.color === color &&
    item.material === material
  );

  if (existente) {
    if (existente.cantidad < producto.stock) {
      existente.cantidad++;
    }
  } else {
    this.carrito.push({
      imagen: producto.imagen,
      nombre: producto.nombre,
      sku: producto.codigo_barras,
      talla,
      color,
      material, // ahora es el material seleccionado
      stock: producto.stock,
      precio: producto.precio,
      cantidad: 1,
    });
  }

  this.actualizarEstado();
}


  eliminarProducto(item: any) {
    this.carrito = this.carrito.filter(p =>
      !(p.sku === item.sku && p.talla === item.talla && p.color === item.color)
    );
    this.actualizarEstado();
  }

  aumentarCantidad(item: any) {
    const producto = this.carrito.find(p => p === item);
    if (producto && producto.cantidad < producto.stock) {
      producto.cantidad++;
      this.actualizarEstado();
    }
  }

  disminuirCantidad(item: any) {
    const producto = this.carrito.find(p => p === item);
    if (producto && producto.cantidad > 1) {
      producto.cantidad--;
      this.actualizarEstado();
    }
  }
  vaciarCarrito() {
  this.carrito = [];
  this.actualizarEstado();
}

actualizarCarrito(carrito: any[]) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

  obtenerCarrito() {
    return [...this.carrito];
  }

  obtenerTotal() {
    return this.carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  }

  obtenerCantidadTotal() {
    return this.carrito.reduce((acc, item) => acc + item.cantidad, 0);
  }

  private actualizarEstado() {
    this.carritoSubject.next(this.obtenerCarrito());
    this.totalItemsSubject.next(this.obtenerCantidadTotal());
  }
}
