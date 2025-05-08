import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';  
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  productos: any[] = [];
  tituloBusqueda: string = 'Productos Nuevos';
  mostrarContenido: boolean = false;
  backendUrl: string = environment.backendUrl;

  // Para el modal
  selectedProduct: any = null;
  showModal: boolean = false;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    // Al entrar a la ruta, leer el parámetro "search"
    this.route.queryParams.subscribe(params => {
      const search = params['search'];
      if (search && search.trim() !== '') {
        this.tituloBusqueda = `Resultados para: ${search}`;
        this.buscarProductos(search);
      } else {
        this.tituloBusqueda = 'Productos Nuevos';
        this.buscarProductos('');  // Llamada para obtener los productos más recientes
      }
    });
    
    setTimeout(() => {
      this.mostrarContenido = true;
    }, 5500);
  }

  buscarProductos(query: string) {
    this.http.get<any[]>(`${this.backendUrl}/buscar_zapatos.php?query=${query}`)
      .subscribe(data => {
        this.productos = data;
      });
  }

  // Funciones para el modal
  verMas(producto: any) {
    this.selectedProduct = producto;
    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;
    this.selectedProduct = null;
  }
  
}
