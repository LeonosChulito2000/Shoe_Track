import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//PANTALLA DE INICIO Y DE CARGA
import { PantallaCargaComponent } from './components/pantalla-carga/pantalla-carga.component';
import { InicioComponent } from './components/inicio/inicio.component';

//PANTALLA DE COMPRA
import { CompraComponent } from './components/compra/compra.component';

//PANTALAL DE PANEL DE ADMIN

import { PanelAdminComponent } from './components/panel-admin/panel-admin.component';


const routes: Routes = [
  { path: '', component: PantallaCargaComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'Pre-Compra', component: CompraComponent },
  { path: 'Admin', component: PanelAdminComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
