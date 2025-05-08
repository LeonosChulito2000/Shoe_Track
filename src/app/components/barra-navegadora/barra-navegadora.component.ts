import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';  // Para la navegación con parámetros
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'; // URL del backend

@Component({
  selector: 'app-barra-navegadora',
  templateUrl: './barra-navegadora.component.html',
  styleUrls: ['./barra-navegadora.component.css']
})
export class BarraNavegadoraComponent implements OnInit {
  query: string = ''; // Texto de búsqueda
  backendUrl: string = environment.backendUrl;
  estrellas: any[] = [];
  planetas: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.generarEstrellas();
    this.generarPlanetas();
  }

  buscarZapatos() {
    if (this.query.trim() === '') return; // Evita búsquedas vacías
    // Navega a la ruta /Inicio pasando la clave 'search'
    this.router.navigate(['/inicio'], { queryParams: { search: this.query } });
  }

  generarEstrellas(): void {
    this.estrellas = []; // Limpiar array
    const cantidadEstrellas = 15 + Math.floor(Math.random() * 15);
    for (let i = 0; i < cantidadEstrellas; i++) {
      this.estrellas.push({
        top: `${Math.random() * 60 + 10}%`,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 3}s`,
        duration: `${1 + Math.random() * 2}s`,
        size: `${0.5 + Math.random() * 1}rem`
      });
    }
  }

  generarPlanetas(): void {
    this.planetas = []; // Limpiar array
    const coloresPlanetas = [
      'radial-gradient(circle at 30% 30%, #a29bfe, #6c5ce7)',
      'radial-gradient(circle at 30% 30%, #55efc4, #00cec9)',
      'radial-gradient(circle at 30% 30%, #ffeaa7, #fab1a0)'
    ];
    for (let i = 0; i < 8; i++) {
      this.planetas.push({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        width: `${Math.floor(Math.random() * (80 - 30 + 1)) + 30}px`,
        height: `${Math.floor(Math.random() * (80 - 30 + 1)) + 30}px`,
        background: coloresPlanetas[Math.floor(Math.random() * coloresPlanetas.length)]
      });
    }
  }
}
