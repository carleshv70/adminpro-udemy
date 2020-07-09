import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class VerificaTokenGuard implements CanActivate {

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
    ) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> | boolean {

      console.log('verifica token guard');

      const token = this.usuarioService.token;
      const payload = JSON.parse( atob(token.split('.')[1] ) );

      const expirado = this.tokenExpirado( payload.exp);

      if (expirado){
          this.router.navigate(['/login']);
          return false;
      }

      // console.log(payload);
      return this.verificaRenueva(payload.exp);
  }

  verificaRenueva(fechaExp: number): Promise<boolean> {
    return new Promise((resolve, reject) => {

      const tokenExp = new Date( fechaExp * 1000);
      const ahora = new Date();

      ahora.setTime( ahora.getTime() + ( 0.25 * 60 * 60 * 1000) );

      console.log(tokenExp);
      console.log(ahora);

      if (tokenExp.getTime() > ahora.getTime() ) {
        resolve(true);
      } else {
        this.usuarioService.renuevaToken()
          .subscribe(
            () => resolve(true),
            () => {
              this.router.navigate(['/login']);
              reject(false);
            });
      }

    });

  }

  tokenExpirado(fechaExp: number) {

    const ahora = new Date().getTime() / 1000;
    return ( fechaExp < ahora);
  }
}
