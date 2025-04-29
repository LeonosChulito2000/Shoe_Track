import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Shoe_Track';
  mostrarNavbar: boolean = true;

  constructor(private router: Router) {
    // Escucha cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Oculta navbar solo en la ruta raíz (pantalla de carga)
      this.mostrarNavbar = !(event.urlAfterRedirects === '/' || event.url === '/');
    });
  }
}
