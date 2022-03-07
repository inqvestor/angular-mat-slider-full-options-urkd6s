import { coerceNumberProperty } from '@angular/cdk/coercion';
import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata';
import { MatSliderChange } from '@angular/material';

interface DateSlider {
  minDate?: string;
  maxDate?: string;
  selectedDate?: Date;
  sliderRange?: number;
}

/**
 * @title Configurable slider
 */
@Component({
  selector: 'slider-configurable-example',
  templateUrl: 'slider-configurable-example.html',
  styleUrls: ['slider-configurable-example.css'],
})
export class SliderConfigurableExample implements OnInit {
  autoTicks = true;
  disabled = false;
  invert = false;
  max = 100;
  min = 0;
  showTicks = true;
  step = 1;
  thumbLabel = true;
  value = 100;
  vertical = false;
  scope: DateSlider = {};
  minDate = '01/14/2016 12:00';
  constructor() {
    this.formatLabel = this.formatLabel.bind(this);
  }

  ngOnInit(): void {
    this.scope.minDate = '01/14/2016 12:00';
    this.scope.maxDate = '01/31/2017 15:30';

    this.scope.selectedDate = new Date(this.scope.maxDate);

    this.scope.sliderRange = this.dayDiff(
      this.scope.minDate,
      this.scope.maxDate
    ); //This will give you range between start and end dates

    this.value = this.max = this.scope.sliderRange;

    // console.log(this.scope);
  }

  get tickInterval(): number | 'auto' {
    return this.showTicks ? (this.autoTicks ? 'auto' : this._tickInterval) : 0;
  }
  set tickInterval(value) {
    this._tickInterval = coerceNumberProperty(value);
  }
  private _tickInterval = 1;

  onSliderChange(event: MatSliderChange) {
    console.log(event.value, this.value, this.max);
    this.scope.selectedDate = this.sliderDate(event.value, this.max);
  }

  sliderDate(sliderValue: number, sliderMax: number) {
    const updatedDate = new Date(this.scope.minDate);
    return this.getFormattedDate(
      sliderValue === sliderMax
        ? updatedDate.setTime(
            updatedDate.getTime() + sliderValue * 86400 * 1000 - 86400 * 1000
          )
        : updatedDate.setTime(
            updatedDate.getTime() + sliderValue * 86400 * 1000
          )
    );
  }

  getFormattedDate(stDate: number) {
    var sDate = new Date(stDate);
    return sDate;
  }

  dayDiff(firstDate: string, secondDate: string) {
    var minDate = new Date(firstDate);
    var maxDate = new Date(secondDate);
    var timeDiff = Math.abs(maxDate.getTime() - minDate.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays;
  }

  formatLabel(value: number) {
    const lbl = this.sliderDate(value, this.max);
    return new DatePipe('en-US').transform(lbl, 'shortDate');
  }
}
