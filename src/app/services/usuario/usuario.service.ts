import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usurio.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';

import Swal from 'sweetalert2';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subirArchivo/subir-archivo.service';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any = [];

  handleErrorResponse = (err: any): Observable<never> => {

    console.log('statusCode', err.status);
    console.log(err.errors);

    let title = err.error.mensaje ;
    let message = err.error.errors.message;
    if (err.status === 401) {

      title = 'Login invalido';
      message = err.error.mensaje;
    }

    Swal.fire({
      icon: 'error',
      title,
      text: message
    });
    return throwError(err.error);
  }

  constructor(
    public http: HttpClient,
    private router: Router,
    private subirArchivoService: SubirArchivoService) {
    console.log('Usuario listo');
    this.cargarStorage();
  }

  logout(){
    this.usuario = null;
    this.token = '';
    this.menu = [];

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('id');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {

      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));

    } else {
      this.usuario = null;
      this.token = '';
      this.menu = [];
    }

  }

  estaLogueado() {
    return (this.token.length > 5);
  }

  guardarStorage(id: string, token: string, usuario: Usuario, menu: any) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  loginGoogle( token: string){
     const url = URL_SERVICIOS + '/login/google';
     return this.http.post(url, { token })
       .pipe(
          map( (resp: any) => {
            this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
            return true;
          })
       );
  }

  login(usuario: Usuario, recordar: boolean): Observable<boolean> {

    console.log('paso');

    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    const url = URL_SERVICIOS + '/login';
    return this.http.post(url, usuario)
      .pipe(
        map( (resp: any) => {
          this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menu);
          return true;
        }),
        catchError(err => this.handleErrorResponse(err) )
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
        }),
        catchError(err => this.handleErrorResponse(err) )
      );
  }

  actualizarUsuario( usuario: Usuario) {

    const url = URL_SERVICIOS + '/usuario/' + usuario._id
    + '?token=' + this.token;
    return this.http.put(url, usuario)
    .pipe(
      map( (resp: any) => {

        if( usuario._id === this.usuario._id) {
          this.guardarStorage(resp.usuario._id, this.token, resp.usuario, this.menu);
        }

        Swal.fire({
          icon: 'success',
          title: 'Usuario actualizado',
          text: usuario.nombre
        });

        return true;

      }),
      catchError(err => this.handleErrorResponse(err) )
    );

  }


  cambiarImagen( file: File, id: string ) {

    this.subirArchivoService.subirArchivo( file, 'usuarios', id)
      .then( (resp: any) => {
        this.usuario.img = resp.usuario.img;

        Swal.fire({
          icon: 'warning',
          title: 'Imagen actualizada',
          text: this.usuario.nombre
        });

        this.guardarStorage( id, this.token, this.usuario, this.menu);

      })
      .catch( resp => {
        console.error(resp);
      });
  }

  cargarUsuarios(desde: number = 0) {

    const url = URL_SERVICIOS + '/usuario?desde=' + desde.toString();
    return this.http.get(url);
  }

  buscarUsuario( termino: string) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;
    return this.http.get(url)
      .pipe(
        map( (resp: any) => resp.usuarios)
      );
  }

  borrarUsuario( id: string) {
    const url = `${URL_SERVICIOS }/usuario/${id}?token=${this.token}`;

    return this.http.delete(url)
      .pipe(
        map( resp => {
          Swal.fire(
            'Borrado!',
            'El usuario ha sido borrado',
            'success'
          );
          return true;
        })
      );
  }
}
