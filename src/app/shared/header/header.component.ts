import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Usuario } from '../../models/usurio.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  usuario: Usuario;

  constructor(public usuarioService: UsuarioService) { 
    
  }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
  }

}
