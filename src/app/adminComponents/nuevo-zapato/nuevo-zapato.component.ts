import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-nuevo-zapato',
  templateUrl: './nuevo-zapato.component.html',
  styleUrls: ['./nuevo-zapato.component.css'] // ← corregido aquí
})
export class NuevoZapatoComponent {
  zapato = {
    nombre: '',
    tallas: '',
    colores: [] as string[],
    materiales: [] as string[],
    precio: '',
    stock: 0
  };
  
  materialesDisponibles = ['piel sintética', 'cuero', 'tela', 'lona'];
  
  onMaterialChange(event: any) {
    const material = event.target.value;
    if (event.target.checked) {
      this.zapato.materiales.push(material);
    } else {
      this.zapato.materiales = this.zapato.materiales.filter(m => m !== material);
    }
  }
  
  coloresDisponibles = [
    { nombre: 'rojo', codigo: 'red' },
    { nombre: 'rosa', codigo: 'pink' },
    { nombre: 'negro', codigo: 'black' },
    { nombre: 'amarillo', codigo: 'yellow' },
    { nombre: 'blanco', codigo: 'white' },
    { nombre: 'azul', codigo: 'blue' },
  ];

  selectedFile: File | null = null;

  onColorChange(event: any) {
    const color = event.target.value;
    if (event.target.checked) {
      this.zapato.colores.push(color);
    } else {
      this.zapato.colores = this.zapato.colores.filter(c => c !== color);
    }
  }

  fileName: string = ''; // Aquí se almacenará el nombre del archivo seleccionado

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0]; // ← esto es lo que faltaba
      this.fileName = this.selectedFile.name;
    } else {
      this.selectedFile = null;
      this.fileName = '';
    }
  }
  
  

  onSubmit() {
    if (!this.selectedFile) {
      alert('Por favor, selecciona una imagen.');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.zapato.nombre);
    formData.append('precio', this.zapato.precio);
    formData.append('tallas', this.zapato.tallas);
    formData.append('colores', this.zapato.colores.join(','));
    formData.append('material', this.zapato.materiales.join(','));
    formData.append('stock', this.zapato.stock.toString());
    formData.append('imagen', this.selectedFile);

    fetch(`${environment.backendUrl}/registrar_zapato.php`, {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      console.log('Respuesta del servidor:', data);
      if (data.status === 'error') {
        alert('Hubo un error al subir el zapato:\n' + data.message);
      } else {
        alert('Zapato registrado con éxito.');
      }
    })
    
      .catch(err => {
        console.error('Error al subir zapato (catch):', err);
        alert('Error al subir zapato');
      });
  }
}
