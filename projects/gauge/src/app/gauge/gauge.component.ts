import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ResizedEvent } from 'angular-resize-event';


@Component({
  selector: 'drayman-gauge-internal',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.scss']
})
export class GaugeComponent implements OnChanges {

  @Input() type = 'full';
  @Input() min = 0;
  @Input() max = 100;
  @Input() value;
  @Input() cap = 'butt';
  @Input() thick = 6;
  @Input() label;
  @Input() foregroundColor = 'rgba(0, 150, 136, 1)';
  @Input() backgroundColor = 'rgba(0, 0, 0, 0.1)';
  @Input() append;
  @Input() prepend;
  @Input() duration = 1500;
  @Input() thresholds = {};
  @Input() markers = {};
  @Input() margin = 0;
  @Input() animate = true;
  @Input() valueLabel;
  @Input() valueStyle;

  size = 200;

  ngOnChanges(simpleChanges: SimpleChanges) {

  }
  onResized(event: ResizedEvent) {
    // console.log(event);
    this.size = (event.newWidth < event.newHeight ? event.newWidth : event.newHeight) - 10;
  }

}

