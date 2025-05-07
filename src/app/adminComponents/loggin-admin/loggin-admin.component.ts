// loggin-admin.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-loggin-admin',
  templateUrl: './loggin-admin.component.html',
})
export class LogginAdminComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AdminAuthService, private router: Router) {}

  login() {
    this.authService.login(this.username, this.password).subscribe(response => {
      if (response.success) {
        this.router.navigate(['/Admin']);
      } else {
        this.errorMessage = response.message;
      }
    }, error => {
      this.errorMessage = "Error de conexión con el servidor.";
    });
  }
}
