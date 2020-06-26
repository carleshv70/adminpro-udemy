import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usurio.model';
import { UsuarioService } from 'src/app/services/service.index';

import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando = true;

  constructor(
    private usuarioService: UsuarioService,
    private modalUploadService: ModalUploadService) { }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.modalUploadService.notificacion
      .subscribe( (resp: any) => {
        console.log('resp');
        this.cargarUsuarios()
      });
  }

  mostrarModal(id: string) {
    this.modalUploadService.mostrarModal('usuarios', id);
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
      .subscribe((resp: any) => {
        console.log(resp);
        this.totalRegistros = resp.total;
        this.usuarios = resp.usuarios;
        this.cargando = false;
      });
  }

  cambiarDesde(valor: number) {

    const desde = this.desde + valor;

    if (desde > this.totalRegistros) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();
  }


  buscarUsuario(termino: string) {

    if (termino.length <= 3) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;
    this.usuarioService.buscarUsuario(termino)
      .subscribe((usuarios: Usuario[]) => {
        this.usuarios = usuarios;
        this.cargando = false;
      });
  }

  borrarUsuario(usuario: Usuario) {

    if (usuario._id === this.usuarioService.usuario._id) {
      Swal.fire({
        icon: 'error',
        title: 'No se puede borrar el usuario',
        text: 'No se puede borrar a si mismo.'
      });
      return;
    }

    Swal.fire({
      title: '¿Esta seguro?',
      text: '¿Está seguro que quiere borrar el usuario ' + usuario.nombre + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borralo!',
      cancelButtonText: 'Cancelar'
    }).then((borrar) => {
      if (borrar.value) {

        this.usuarioService.borrarUsuario( usuario._id)
          .subscribe( borrado => {

            console.log('borrado', borrado);
            this.desde = 0;
            this.cargarUsuarios();

          });

      }
    });


  }

  guardarUsuario(usuario: Usuario) {
    this.usuarioService.actualizarUsuario(usuario)
      .subscribe();
  }
}
