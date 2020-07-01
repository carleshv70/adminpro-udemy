import { Component, OnInit, Input } from '@angular/core';
import Swal from 'sweetalert2';
import { SubirArchivoService } from 'src/app/services/service.index';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: [
  ]
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: string | ArrayBuffer;

  constructor(
    public subirArchivoService: SubirArchivoService,
    public modalUploadService: ModalUploadService) {
  }

  ngOnInit(): void {
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

  subirImagen() {
    this.subirArchivoService.subirArchivo(
      this.imagenSubir,
      this.modalUploadService.tipo,
      this.modalUploadService.id
      )
      .then( resp => {
        this.modalUploadService.notificacion.emit(resp);
        this.ocultarModal();
      })
      .catch( err => {
        console.error('Error en la carga', err);
      });
  }

  ocultarModal() {
    this.subirImagen = null;
    this.imagenTemp = null;
    this.modalUploadService.ocultarModal();
  }
}
