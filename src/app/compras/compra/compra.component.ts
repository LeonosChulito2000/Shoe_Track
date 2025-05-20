import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css']
})
export class CompraComponent {

  mostrarFormulario = false;
  correoInput = '';
  datosUsuario: any = {
    id: null,
    nombres: '',
    apellido_paterno: '',
    apellido_materno: '',
    correo: '',
    telefono: '',
    fecha_registro: '',
    direccion_envio: '',
    numero_pedidos: 0
  };
  originalData: any = {};
  mensaje = '';
  usuarioExiste = false;

  constructor(private http: HttpClient, private router: Router) {}

  buscarUsuario() {
    if (!this.correoInput) return;
  
    console.log('Correo enviado:', this.correoInput); // Verificar que el correo se está enviando correctamente
  
    const backendUrl = environment.backendUrl; // Usamos la URL del backend configurada en environment
  
    this.http.post<any>(`${backendUrl}/buscar_usuario.php`, {
      correo: this.correoInput
    }).subscribe(response => {
      console.log('Respuesta del servidor:', response); // Verificar la respuesta del backend
  
      this.mostrarFormulario = true;
  
      if (response.success && response.usuario) {
        this.usuarioExiste = true;
        this.datosUsuario = { ...response.usuario };
        this.originalData = { ...response.usuario }; // para detectar cambios
  
        this.mensaje = `¡Gracias por tu confianza! ✨\n  \n🚀 ¡${this.datosUsuario.numero_pedidos} pedidos hasta ahora! 🚀\n\n🌟 Sigue marcando el camino del mundo. 🌟`;

      } else {
        this.usuarioExiste = false;
        this.datosUsuario = {
          id: null,
          nombres: '',
          apellido_paterno: '',
          apellido_materno: '',
          correo: this.correoInput,
          telefono: '',
          fecha_registro: this.getFechaActual(), // Asigna la fecha actual cuando es nuevo
          direccion_envio: '',
          numero_pedidos: 0
        };
        this.originalData = {};
        this.mensaje = 'Regístrate y continúa tu camino.';
      }
    });
  }
  

  // Método para obtener la fecha actual en formato YYYY-MM-DD
  getFechaActual(): string {
    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Asegura que el mes tenga 2 dígitos
    const dia = fecha.getDate().toString().padStart(2, '0'); // Asegura que el día tenga 2 dígitos
    return `${anio}-${mes}-${dia}`;
  }
  
  mostrarModal = false;
mensajeModal = '';
camposActualizados: string[] = [];

cerrarModal() {
  this.mostrarModal = false;
  this.mensajeModal = '';
  this.camposActualizados = [];
}


  hayCambios(): boolean {
    return Object.keys(this.datosUsuario).some(key => {
      return this.datosUsuario[key] !== this.originalData[key];
    });
  }

  get nombreCompleto(): string {
    const { apellido_paterno, apellido_materno, nombres } = this.datosUsuario;
    return `${apellido_paterno} ${apellido_materno} ${nombres}`.trim();
  }
  
  autoAjustarAltura(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto'; // Reinicia altura para medir bien
    const maxAltura = 200;
    textarea.style.height = Math.min(textarea.scrollHeight, maxAltura) + 'px';
  }
  
  // Método para detectar campos cambiados permitidos (telefono y direccion_envio)
obtenerCamposCambiados(): string[] {
  const campos = [];
  if (this.datosUsuario.telefono !== this.originalData.telefono) {
    campos.push('Teléfono');
  }
  if (this.datosUsuario.direccion_envio !== this.originalData.direccion_envio) {
    campos.push('Dirección de envío');
  }
  return campos;
}

onSubmit() {
  let endpoint = 'registrar_usuario.php';

  const payload = { ...this.datosUsuario };

  if (this.usuarioExiste) {
    if (this.hayCambios()) {
      endpoint = 'actualizar_usuario.php';
      payload.numero_pedidos += 1;
    } else {
      // Usuario existe y no hay cambios, solo redirigir
      this.router.navigate(['/Finaliza-la-Compra']);
      return;
    }
  } else {
    payload.numero_pedidos = 0;
  }

  const backendUrl = environment.backendUrl;

  this.http.post<any>(`${backendUrl}/${endpoint}`, payload).subscribe(response => {
    if (response.success) {
      localStorage.setItem('datosUsuario', JSON.stringify(this.datosUsuario));
      this.mostrarFormulario = false;

      if (!this.usuarioExiste) {
        this.mensajeModal = '🎉 ¡Felicidades por iniciar tu camino! 🎉\nQuédate con nosotros y recibirás premios en el futuro.';
        this.mostrarModal = true;

        setTimeout(() => {
          this.mostrarModal = false;
          this.router.navigate(['/Finaliza-la-Compra']);
        }, 5000);
      } else {
        this.camposActualizados = this.obtenerCamposCambiados();
        this.mensajeModal = 'Datos actualizados correctamente:';
        this.mostrarModal = true;

        setTimeout(() => {
          this.mostrarModal = false;
          this.router.navigate(['/Finaliza-la-Compra']);
        }, 5000);
      }
    } else {
      this.mensajeModal = 'Error al actualizar o registrar usuario.';
      this.mostrarModal = true;
    }
  });
}



}
