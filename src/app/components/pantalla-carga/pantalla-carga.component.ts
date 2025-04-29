import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pantalla-carga',
  templateUrl: './pantalla-carga.component.html',
  styleUrls: ['./pantalla-carga.component.css']
})
export class PantallaCargaComponent implements OnInit {
  progreso: number = 0;
  estrellas: any[] = [];
  imagenes: string[] = [
    'INI1.png',
    'INI2.png',
    'INI3.png',
    'INI4.png',
    'INI5.png',
    'INI6.png',
    'INI7.png',
    'INI8.png'
  ];

  imagenActual: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Generación de estrellas aleatorias
    this.generarEstrellas();

    // Cambio de imagen cada 500ms
    setInterval(() => {
      this.imagenActual = (this.imagenActual + 1) % this.imagenes.length;
    }, 400);

    // Carga de progreso
    const intervalo = setInterval(() => {
      this.progreso += 2; // Aumenta el progreso

      if (this.progreso >= 100) {
        clearInterval(intervalo);
        this.router.navigate(['/inicio']);
      }
    }, 101); // 100ms * 50 = 5s
  }

  generarEstrellas(): void {
    // Generar un número aleatorio de estrellas
    const cantidadEstrellas = 20 + Math.floor(Math.random() * 30); // Entre 20 y 50 estrellas

    for (let i = 0; i < cantidadEstrellas; i++) {
      const top = Math.random() * 100; // Posición vertical aleatoria (de 0 a 100%)
      const left = Math.random() * 100; // Posición horizontal aleatoria (de 0 a 100%)
      const delay = Math.random() * 3; // Retraso aleatorio antes de que empiece a titilar
      const duration = 1 + Math.random() * 2; // Duración aleatoria del titileo

      // Guardamos los detalles de la estrella en el array
      this.estrellas.push({
        top: `${top}%`,
        left: `${left}%`,
        delay: `${delay}s`,
        duration: `${duration}s`
      });
    }
  }
}
