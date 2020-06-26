import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usurio.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';

import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SubirArchivoService } from '../subirArchivo/subir-archivo.service';

@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;

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

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('id');

    this.router.navigate(['/login']);
  }
  
  cargarStorage() {
    if (localStorage.getItem('token')) {

      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.usuario = null;
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

    this.usuario = usuario;
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

  actualizarUsuario( usuario: Usuario) {

    const url = URL_SERVICIOS + '/usuario/' + usuario._id
    + '?token=' + this.token;
    return this.http.put(url, usuario)
    .pipe(
      map( (resp: any) => {

        if( usuario._id === this.usuario._id) {
          this.guardarStorage(resp.usuario._id, this.token, resp.usuario);
        }

        Swal.fire({
          icon: 'success',
          title: 'Usuario actualizado',
          text: usuario.nombre
        });

        return true;

      })
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

        this.guardarStorage( id, this.token, this.usuario);

      })
      .catch( resp => {
        console.error(resp);
      })
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
