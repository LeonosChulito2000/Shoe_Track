import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//PANTALLA DE INICIO Y DE CARGA
import { PantallaCargaComponent } from './components/pantalla-carga/pantalla-carga.component';
import { InicioComponent } from './components/inicio/inicio.component';


const routes: Routes = [
  { path: '', component: PantallaCargaComponent },
  { path: 'inicio', component: InicioComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
