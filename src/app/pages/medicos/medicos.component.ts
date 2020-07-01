import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/medico/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit {

  cargando = true;
  totalRegistros = 0;
  desde = 0;
  medicos: Medico[] = [];

  constructor(private medicoService: MedicoService) { }

  ngOnInit(): void {
    this.cargarMedicos();
  }

  buscarMedico( termino: string) {

    if (termino.length <= 0) {
      this.desde = 0;
      this.cargarMedicos();
      return;
    }

    this.medicoService.buscarMedicos(termino)
      .subscribe( (medicos: Medico[]) => {
        this.medicos = medicos;
      });
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos()
      .subscribe( (medicos: any) => {
        this.medicos = medicos;
        this.totalRegistros = this.medicoService.totalMedicos;
        this.cargando = false;
      } );
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
    this.cargarMedicos();
  }

  borrarMedico(medico: Medico) {
    Swal.fire({
      title: '¿Esta seguro?',
      text: '¿Está seguro que quiere borrar el médico ' + medico.nombre + '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borralo!',
      cancelButtonText: 'Cancelar'
    }).then((borrar) => {
      if (borrar.value) {

        this.medicoService.borrarMedico(medico._id)
          .subscribe(borrado => {

            console.log('borrado', borrado);
            this.desde = 0;
            this.cargarMedicos();

          });

      }
    });
  }

}
