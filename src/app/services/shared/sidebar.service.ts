import { Injectable } from '@angular/core';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable()
export class SidebarService {

  menu: any = [];

  // menu: any = [
  //   {
  //     titulo: 'Principal',
  //     icono: 'mdi mdi-gauge',
  //     submenu: [
  //       { titulo: 'Dashboard', url: '/dashboard' },
  //       { titulo: 'ProgressBar', url: '/progress' },
  //       { titulo: 'Graficas', url: '/grafica1' },
  //       { titulo: 'Promesas', url: '/promesas' },
  //       { titulo: 'Rxjs', url: '/rxjs' }
  //     ]
  //   },
  //   {
  //     titulo: 'Mantenimientos',
  //     icono: 'mdi mdi-folder-lock-open',
  //     submenu: [
  //       { titulo: 'Usuarios', url: '/usuarios'},
  //       { titulo: 'Hospitales', url: '/hospitales'},
  //       { titulo: 'Medicos', url: '/medicos'},
  //     ]
  //   }
  // ];

  constructor(private usuarioService: UsuarioService) {
  }
  
  cargarMenu() {
    
    this.menu = this.usuarioService.menu;
   }
}
