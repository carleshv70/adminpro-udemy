import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';


@Injectable({
  providedIn: 'root'
})
export class LoginGuardGuard implements CanActivate {

  constructor(
    private usuarioService: UsuarioService,
    private router: Router){}

  canActivate(): boolean {

    if (this.usuarioService.estaLogueado() ) {
      console.log('PASO EL GUARD');
      return true;
    } else {
      console.log('Bloqueado por el guard');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
