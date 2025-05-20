import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-nuevo-zapato',
  templateUrl: './nuevo-zapato.component.html',
  styleUrls: ['./nuevo-zapato.component.css']
})
export class NuevoZapatoComponent implements OnInit {
  
  // Variables para el modal de error
  showErrorModal: boolean = false;
  errorMessage: string = '';
  
  showSuccessModal: boolean = false;  // Propiedad (no hay problema aquí)
  successMessage: string = '';

zapato = {
  codigo_barras: '',
  nombre: '',
  tallas: '',
  colores: [] as string[],
  materiales: [] as string[],
  precio: '',
  stock: 0
};


  materialesDisponibles = ['piel sintética', 'cuero', 'tela', 'lona'];

  // Cambia el nombre del método de showSuccessModal a displaySuccessMessage
  displaySuccessMessage() {
    this.showSuccessModal = true;
    setTimeout(() => {
      this.showSuccessModal = false;
    }, 5000); // 5 segundos
  }

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
  fileName: string = ''; // Nombre del archivo seleccionado
  imagePreview: string | ArrayBuffer | null = null; // Vista previa de la imagen

  onColorChange(event: any) {
    const color = event.target.value;
    if (event.target.checked) {
      this.zapato.colores.push(color);
    } else {
      this.zapato.colores = this.zapato.colores.filter(c => c !== color);
    }
  }

  // Método para manejar la selección de archivo
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0]; // Guarda el archivo
      this.fileName = this.selectedFile.name; // Muestra el nombre del archivo
      this.previewImage(this.selectedFile); // Muestra la vista previa
    } else {
      this.selectedFile = null;
      this.fileName = '';
      this.imagePreview = null;
    }
  }

  // Método para generar la vista previa de la imagen
  previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result; // Asigna la URL de la imagen a la vista previa
    };
    reader.readAsDataURL(file); // Convierte el archivo a una URL de datos
  }

  // Método para enviar el formulario
  onSubmit() {
    if (!this.zapato.nombre || !this.zapato.precio || !this.zapato.tallas || !this.zapato.stock || !this.selectedFile) {
      this.errorMessage = 'Por favor, complete todos los campos requeridos.';
      this.showErrorModal = true;
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.zapato.nombre);
    formData.append('codigo_barras', this.zapato.codigo_barras);
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
      if (data.status === 'error') {
        this.errorMessage = 'Hubo un error al subir el zapato:\n' + data.message;
        this.showErrorModal = true;
      } else {
        this.successMessage = '¡Zapato registrado con éxito!';
        this.displaySuccessMessage();  // Llamar al nuevo método
      }
    })
    .catch(err => {
      console.error('Error al subir zapato:', err);
      this.errorMessage = 'Error al subir zapato.';
      this.showErrorModal = true;
    });
  }

  // Método para cerrar el modal de éxito después de 5 segundos
  closeModalAfterDelay() {
    setTimeout(() => {
      this.showSuccessModal = false;
    }, 5000); // 5 segundos
  }

  // Método para cerrar el modal de éxito
  closeSuccessModal() {
    this.showSuccessModal = false;
  }

  // Método para cerrar el modal de error
  closeErrorModal() {
    this.showErrorModal = false;
  }

  ngOnInit() {
  this.zapato.codigo_barras = Math.floor(100000000 + Math.random() * 900000000).toString();
}

}
