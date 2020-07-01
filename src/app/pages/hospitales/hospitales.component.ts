import { Component, OnInit } from '@angular/core';
import { HospitalService } from '../../services/hospital/hospital.service';
import { Hospital } from 'src/app/models/hospital.model';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando = true;

  constructor(
    private hospitalService: HospitalService,
    private modalUploadService: ModalUploadService) { }

  ngOnInit(): void {
    this.cargarHospitales();
    this.modalUploadService.notificacion
      .subscribe((resp: any) => this.cargarHospitales());
  }

  mostrarModal(id: string) {
    this.modalUploadService.mostrarModal('hospitales', id);
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales(this.desde)
      .subscribe((hospitales: Hospital[]) => {
        this.totalRegistros = this.hospitalService.totalHospitales;
        this.hospitales = hospitales;
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
    this.cargarHospitales();
  }


  buscarHospital(termino: string) {

    if (termino.length <= 3) {
      this.cargarHospitales();
      return;
    }

    this.cargando = true;
    this.hospitalService.buscarHospital(termino)
      .subscribe((hospitales: Hospital[]) => {
        this.hospitales = hospitales;
        this.cargando = false;
      });
  }

  borrarHospital(hospital: Hospital) {

    Swal.fire({
      title: '¿Esta seguro?',
      text: '¿Está seguro que quiere borrar el hospital ' + hospital.nombre + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borralo!',
      cancelButtonText: 'Cancelar'
    }).then((borrar) => {
      if (borrar.value) {

        this.hospitalService.borrarHospital(hospital._id)
          .subscribe(borrado => {

            console.log('borrado', borrado);
            this.desde = 0;
            this.cargarHospitales();

          });

      }
    });


  }

  guardarHospital(hospital: Hospital) {
    this.hospitalService.actualizarHospital(hospital)
      .subscribe();
  }

  crearHospital() {
    Swal.fire({
      title: 'Nombre del hospital',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Crear',
      showLoaderOnConfirm: true,
      preConfirm: (nombreHospital) => {

        if (!nombreHospital || nombreHospital.lenght === 0){
          return;
        }

        return this.hospitalService.crearHospital(nombreHospital)
          .subscribe(resp => console.log(resp));
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.value) {
        this.cargarHospitales();
      }
    });
  }

}
