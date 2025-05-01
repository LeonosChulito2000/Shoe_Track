import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {

  mostrarContenido = false;

  productos = [
    { nombre: 'Producto 1', imagen: 'INI1.png' },
    { nombre: 'Producto 2', imagen: 'INI2.png' },
    { nombre: 'Producto 3', imagen: 'INI3.png' },
    { nombre: 'Producto 4', imagen: 'INI4.png' },
    { nombre: 'Producto 5', imagen: 'INI5.png' },
    { nombre: 'Producto 6', imagen: 'INI6.png' },
    { nombre: 'Producto 7', imagen: 'INI7.png' },
    { nombre: 'Producto 8', imagen: 'INI8.png' }
  //  { nombre: 'Producto 9', imagen: 'INI.png' }
  ];

  ngOnInit(): void {
    setTimeout(() => {
      this.mostrarContenido = true;
    }, 5500);
  }
}

