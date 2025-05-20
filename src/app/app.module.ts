import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PantallaCargaComponent } from './components/pantalla-carga/pantalla-carga.component';
import { BarraNavegadoraComponent } from './components/barra-navegadora/barra-navegadora.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { CompraComponent } from './compras/compra/compra.component';
import { PanelAdminComponent } from './adminComponents/panel-admin/panel-admin.component';
import { NuevoZapatoComponent } from './adminComponents/nuevo-zapato/nuevo-zapato.component';
import { LogginAdminComponent } from './adminComponents/loggin-admin/loggin-admin.component';
import { CarritoDeComprasComponent } from './compras/carrito-de-compras/carrito-de-compras.component';
import { FinalizaCompraComponent } from './compras/finaliza-compra/finaliza-compra.component';
import { EstadoDePedidoComponent } from './compras/estado-de-pedido/estado-de-pedido.component';

@NgModule({
  declarations: [
    AppComponent,
    PantallaCargaComponent,
    BarraNavegadoraComponent,
    InicioComponent,
    CompraComponent,
    BarraNavegadoraComponent,
    PanelAdminComponent,
    NuevoZapatoComponent,
    LogginAdminComponent,
    CarritoDeComprasComponent,
    FinalizaCompraComponent,
    EstadoDePedidoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
