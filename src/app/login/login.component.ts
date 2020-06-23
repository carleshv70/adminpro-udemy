import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/usuario/usuario.service';
import { Usuario } from '../models/usurio.model';

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  recuerdame = false;
  email: string;

  auth2: any;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    init_plugins();
    this.googleInit();

    this.email = localStorage.getItem('email') || '';
    this.recuerdame = (this.email.length > 0);
  }

  googleInit(){
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '578572139240-uuk3tdfsjqdki9u7t1rcklqtlcjuf0us.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });

      this.attachSignin( document.getElementById('btnGoogle'));
    });
  }

  attachSignin( element ) {
    this.auth2.attachClickHandler( element, {}, (googleUser) => {
      //const profile = googleUser.getBasicProfile();
      const token = googleUser.getAuthResponse().id_token;

      this.usuarioService.loginGoogle( token)
        .subscribe( resp => window.location.href = '#/dashboard' );
    });
  }

  ingresar(forma: NgForm) {

    if (forma.invalid) {
      return;
    }

    const usuario = new Usuario(null, forma.value.email, forma.value.password);

    this.usuarioService.login(usuario, forma.value.recuerdame)
      .subscribe(res =>  this.router.navigate(['/dashboard']));
  }

}
