import { Component, OnInit, Input } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';

@Component({
  selector: 'app-grafica-dona',
  templateUrl: './grafica-dona.component.html',
  styles: [
  ]
})
export class GraficaDonaComponent implements OnInit {

  @Input()
  public labels: Label[];

  @Input()
  public data: MultiDataSet;

  @Input()
  public type: ChartType;

  constructor() { }

  ngOnInit(): void {
  }

}
