import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PantallaCargaComponent } from './components/pantalla-carga/pantalla-carga.component';
import { BarraNavegadoraComponent } from './components/barra-navegadora/barra-navegadora.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { CompraComponent } from './components/compra/compra.component';

@NgModule({
  declarations: [
    AppComponent,
    PantallaCargaComponent,
    BarraNavegadoraComponent,
    InicioComponent,
    CompraComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
