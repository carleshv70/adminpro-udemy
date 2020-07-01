import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Medico } from 'src/app/models/medico.model';
import { URL_SERVICIOS } from '../../config/config';
import Swal from 'sweetalert2';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class MedicoService {

  totalMedicos = 0;
  get token() { return this.usuarioService.token; }

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService) { }

  cargarMedicos() {
    const url = URL_SERVICIOS + '/medico';
    return this.http.get(url)
      .pipe(
        map( (resp: any) => {
          this.totalMedicos = resp.total;
          return resp.medicos;
        })
      );
  }

  buscarMedicos(termino: string) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termino;
    return this.http.get(url)
      .pipe(
        map( (resp: any) => resp.medicos)
      );
  }

  borrarMedico( id: string) {

    const url = `${URL_SERVICIOS }/medico/${id}?token=${this.token}`;

    return this.http.delete(url)
      .pipe(
        map( resp => {
          Swal.fire(
            'Borrado!',
            'El medico ha sido borrado',
            'success'
          );
          return true;
        })
      );
  }

  guardarMedico(medico: Medico) {

    let url = `${URL_SERVICIOS }/medico`;

    if (medico._id) {
      // Actualizando
      url += `/${medico._id}?token=${this.token}`;

      return this.http.put(url, medico )
        .pipe(
          map( (resp: any) => {

            Swal.fire({
              icon: 'success',
              title: 'Médico actualizado',
              text: medico.nombre
            });


            return resp.medico;
          })
        );


    } else {
      // Creando

      url += `?token=${this.token}`;

      return this.http.post(url, medico)
        .pipe(
          map( (resp: any) => {

            Swal.fire({
              icon: 'success',
              title: 'Médico creado',
              text: medico.nombre
            });

            return resp.medico;
          })
        );
    }


  }

  cargarMedico(id: string) {

    const url = URL_SERVICIOS + '/medico/' + id;

    return this.http.get(url)
      .pipe(
        map( (resp: any) => resp.medico)
      );

  }
}
