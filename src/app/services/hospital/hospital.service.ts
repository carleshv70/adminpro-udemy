import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';
import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpClient } from '@angular/common/http';
import { Hospital } from 'src/app/models/hospital.model';
import { UsuarioService } from '../usuario/usuario.service';
import { Observable } from 'rxjs';

@Injectable()
export class HospitalService {

  totalHospitales: number = 0;

  get token() { return this.usuarioService.token; }

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService) { }

  cargarHospitales(desde: number = 0): Observable<Hospital[]> {

    const url = URL_SERVICIOS + '/hospital?desde=' + desde.toString();
    return this.http.get(url)
      .pipe(
        map( (resp: any) => {
          this.totalHospitales = resp.total;
          return resp.hospitales;
        })
      );
  }

  obtenerHospital( id: string ): Observable<Hospital> {
    const url = URL_SERVICIOS + '/hospital/' + id;
    return this.http.get(url)
      .pipe(
        map( (resp: any) => resp.hospital)
      );
  }

  // Recibe un ID de un hospital y lo borra
  borrarHospital( id: string ) {
    const url = `${URL_SERVICIOS }/hospital/${id}?token=${this.token}`;

    return this.http.delete(url)
      .pipe(
        map( resp => {
          Swal.fire(
            'Borrado!',
            'El hospital ha sido borrado',
            'success'
          );
          return true;
        })
      );
  }
  
  // Recibe el nombre del hospital y lo crea.
  crearHospital( nombre: string ) {

    const url = URL_SERVICIOS + '/hospital?token=' + this.token;

    return this.http.post(url, new Hospital(nombre))
      .pipe(
        map( (resp: any) => {

          Swal.fire({
            icon: 'success',
            title: 'Hospital creado',
            text: nombre
          });

          return resp.hospital;
        })
      );

  }

  // Recibe el término de búsqueda y retorna todos los hospitales que coincidan con ese término de búsqueda.
  buscarHospital( termino: string ) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;
    return this.http.get(url)
      .pipe(
        map( (resp: any) => resp.hospitales)
      );
  }
  
  // Recibe un hospital y lo actualiza.
  actualizarHospital( hospital: Hospital ) {

    const url = URL_SERVICIOS + '/hospital/' + hospital._id
    + '?token=' + this.token;
    return this.http.put(url, hospital)
    .pipe(
      map( (resp: any) => {

        Swal.fire({
          icon: 'success',
          title: 'hospital actualizado',
          text: hospital.nombre
        });
        return true;
      })
    );
  }


}
