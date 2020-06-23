import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usurio.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';

import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class UsuarioService {

  Usuario: Usuario;
  token: string;

  constructor(
    public http: HttpClient,
    private router: Router) {
    console.log('Usuario listo');
    this.cargarStorage();
  }

  logout(){
    this.Usuario = null;
    this.token = '';

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('id');

    this.router.navigate(['/login']);
  }
  
  cargarStorage() {
    if (localStorage.getItem('token')) {

      this.token = localStorage.getItem('token');
      this.Usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.Usuario = null;
      this.token = '';
    }

  }

  estaLogueado() {
    return (this.token.length > 5);
  }

  guardarStorage(id: string, token: string, usuario: Usuario) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.Usuario = usuario;
    this.token = token;
  }

  loginGoogle( token: string){
     const url = URL_SERVICIOS + '/login/google';
     return this.http.post(url, { token })
       .pipe(
          map( (resp: any) => {
            this.guardarStorage(resp.id, resp.token, resp.usuario);
            return true;
          })
       );
  }

  login(usuario: Usuario, recordar: boolean) {

    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    const url = URL_SERVICIOS + '/login';
    return this.http.post(url, usuario)
      .pipe(
        map( (resp: any) => {
          this.guardarStorage(resp.id, resp.token, resp.usuario);
          return true;
        })
      );
      
  }

  crearUsuario(usuario: Usuario) {

    const url = URL_SERVICIOS + '/usuario';

    return this.http.post(url, usuario)
      .pipe(
        map( (resp: any) => {

          Swal.fire({
            icon: 'success',
            title: 'Usuario creado',
            text: usuario.email
          });

          return resp.usuario;
        })
      );
  }
}
