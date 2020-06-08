import { Component, OnInit, OnDestroy } from '@angular/core';
//import { Observable } from 'rxjs/internal/Observable';
import { retry, map, filter } from 'rxjs/operators';
import { Subscriber,  Observable, Subscription } from 'rxjs';


@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnInit, OnDestroy {
  
  subs: Subscription;

  constructor() {

    this.subs = this.regresaObservable()
    .subscribe(
      c => console.log('Subs', c),
      err => console.error('Error en el obs', err),
      () => console.log('El observador termino')
    );
   

  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    
    this.subs.unsubscribe();
  }

  regresaObservable(): Observable<any> {
    return new Observable( (observer: Subscriber<any>) => {

      let contador = 0;

      const intervalo = setInterval( () => {

        contador += 1;

        const salida = {
          valor: contador
        };

        observer.next(salida);

        // if (contador === 10) {
        //   clearInterval(intervalo);
        //   observer.complete();
        // }

        // if (contador === 2) {
        //   //clearInterval(intervalo);
        //   observer.error('Auxilio');
        // }

      }, 1000);

    }).pipe(
      map( resp => resp.valor),
      filter(numero => ( numero % 2) === 1 )
    );

  }

}
