import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//PANTALLA DE INICIO Y DE CARGA
import { PantallaCargaComponent } from './components/pantalla-carga/pantalla-carga.component';
import { InicioComponent } from './components/inicio/inicio.component';

//PANTALLA DE COMPRA
import { CompraComponent } from './components/compra/compra.component';

//PANTALAL DE PANEL DE ADMIN
import { PanelAdminComponent } from './adminComponents/panel-admin/panel-admin.component';
import { NuevoZapatoComponent } from './adminComponents/nuevo-zapato/nuevo-zapato.component';


const routes: Routes = [
  { path: '', component: PantallaCargaComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'Pre-Compra', component: CompraComponent },
  { path: 'Admin', component: PanelAdminComponent },
  { path: 'NuevoZapato', component: NuevoZapatoComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
