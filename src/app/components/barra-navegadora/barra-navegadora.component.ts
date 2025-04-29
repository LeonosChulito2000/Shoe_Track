import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-barra-navegadora',
  templateUrl: './barra-navegadora.component.html',
  styleUrls: ['./barra-navegadora.component.css']
})
export class BarraNavegadoraComponent implements OnInit, AfterViewInit {
  estrellas: any[] = [];
  planetas: any[] = [];

  ngOnInit(): void {
    // Generación de estrellas aleatorias
    this.generarEstrellas();
  }

  ngAfterViewInit(): void {
    // Después de que la vista se inicialice, generar los planetas
    this.generarPlanetas();
  }

  generarEstrellas(): void {
    const cantidadEstrellas = 15 + Math.floor(Math.random() * 15); // Entre 10 y 20 estrellas

    for (let i = 0; i < cantidadEstrellas; i++) {
      const top = Math.random() * 60 + 10; // Posición vertical aleatoria (de 10% a 70%)
      const left = Math.random() * 100; // Posición horizontal aleatoria (de 0% a 100%)
      const delay = Math.random() * 3; // Retraso aleatorio antes de que empiece a titilar
      const duration = 1 + Math.random() * 2; // Duración aleatoria del titileo
      const size = 0.5 + Math.random() * 1; // Tamaño aleatorio entre 0.5 y 2 rem

      // Guardamos los detalles de la estrella en el array
      this.estrellas.push({
        top: `${top}%`,
        left: `${left}%`,
        delay: `${delay}s`,
        duration: `${duration}s`,
        size: `${size}rem`  // Tamaño aleatorio
      });
    }
  }

  generarPlanetas(): void {
    const cantidadPlanetas = 8;  // Número de planetas a generar
    const coloresPlanetas = [
      'radial-gradient(circle at 30% 30%, #a29bfe, #6c5ce7)',
      'radial-gradient(circle at 30% 30%, #55efc4, #00cec9)',
      'radial-gradient(circle at 30% 30%, #ffeaa7, #fab1a0)',
      'radial-gradient(circle at 30% 30%, #fd79a8, #e84393)',
      'radial-gradient(circle at 30% 30%, #74b9ff, #0984e3)',
      'radial-gradient(circle at 30% 30%, #e17055, #d63031)',
      'radial-gradient(circle at 30% 30%, #00b894, #00cec9)',
      'radial-gradient(circle at 30% 30%, #636e72, #2d3436)'
    ];

    for (let i = 0; i < cantidadPlanetas; i++) {
      const tamano = Math.floor(Math.random() * (80 - 30 + 1)) + 30;  // Tamaño aleatorio entre 30px y 80px
      const color = coloresPlanetas[Math.floor(Math.random() * coloresPlanetas.length)];
      const top = Math.random() * 100;  // Posición vertical aleatoria (de 0% a 100%)
      const left = Math.random() * 100;  // Posición horizontal aleatoria (de 0% a 100%)

      // Guardamos los detalles del planeta en el array
      this.planetas.push({
        top: `${top}%`,
        left: `${left}%`,
        width: `${tamano}px`,
        height: `${tamano}px`,
        background: color
      });
    }
  }
}
