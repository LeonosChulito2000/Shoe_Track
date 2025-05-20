import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//PANTALLA DE INICIO Y DE CARGA
import { PantallaCargaComponent } from './components/pantalla-carga/pantalla-carga.component';
import { InicioComponent } from './components/inicio/inicio.component';

//PANTALLA DE COMPRA
import { CompraComponent } from './compras/compra/compra.component';
import { CarritoDeComprasComponent } from './compras/carrito-de-compras/carrito-de-compras.component';
import { FinalizaCompraComponent } from './compras/finaliza-compra/finaliza-compra.component';
import { EstadoDePedidoComponent } from './compras/estado-de-pedido/estado-de-pedido.component';

//PANTALAL DE PANEL DE ADMIN
import { LogginAdminComponent } from './adminComponents/loggin-admin/loggin-admin.component';
import { PanelAdminComponent } from './adminComponents/panel-admin/panel-admin.component';
import { NuevoZapatoComponent } from './adminComponents/nuevo-zapato/nuevo-zapato.component';



const routes: Routes = [
  { path: '', component: PantallaCargaComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'Usuario-de-Compra', component: CompraComponent },
  { path: 'AdminLogin', component: LogginAdminComponent },
  { path: 'Admin', component: PanelAdminComponent },
  { path: 'NuevoZapato', component: NuevoZapatoComponent },
  { path: 'Carrito-de-Compras', component: CarritoDeComprasComponent },
  { path: 'Finaliza-la-Compra', component: FinalizaCompraComponent },
  { path: 'estado-pedido', component: EstadoDePedidoComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
