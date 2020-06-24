import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usurio.model';
import { UsuarioService } from '../../services/usuario/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent implements OnInit {

  usuario: Usuario;
  imagenSubir: File;
  imagenTemp: string | ArrayBuffer;

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
  }

  guardar(usuario: Usuario) {

    this.usuario.nombre = usuario.nombre;
    if (!this.usuario.google) {
      this.usuario.email = usuario.email;
    }
    this.usuarioService.actualizarUsuario(this.usuario)
      .subscribe();
  }

  seleccionImagen(archivo: File) {
  
    if (!archivo) {
      this.imagenSubir = null;
      return;
    }

    if (archivo.type.indexOf('image') < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Solo imágenes',
        text: 'El archivo seleccionado no es una imagen'
      });
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;

    const reader = new FileReader();
    reader.readAsDataURL(archivo);
 
    reader.onloadend = () => this.imagenTemp = reader.result;
  }

  cambiarImagen(){
    this.usuarioService.cambiarImagen(this.imagenSubir, this.usuario._id);
  }

}
