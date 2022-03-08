import { coerceNumberProperty } from '@angular/cdk/coercion';
import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata';
import { MatSliderChange } from '@angular/material';
import { Observable, from } from 'rxjs';
import { filter, map } from 'rxjs/operators';

interface DateSlider {
  minDate?: Date;
  maxDate?: Date;
  selectedDate?: Date;
  sliderRange?: number;
}

@Component({
  selector: 'slider-configurable-example',
  templateUrl: 'slider-configurable-example.html',
  styleUrls: ['slider-configurable-example.css'],
})
export class SliderConfigurableExample implements OnInit {
  testData = [
    '1/14/2016',
    '1/31/2016',
    '2/6/2016',
    '2/1/2016',
    '5/2/2016',
    '4/18/2016',
    '4/28/2016',
    '8/29/2016',
    '9/24/2016',
    '11/8/2016',
    '10/11/2016',
    '5/3/2016',
    '6/2/2016',
    '7/13/2016',
    '8/6/2016',
    '10/31/2016',
    '1/4/2017',
    '1/31/2017',
  ];
  sampleDates = [];
  sampleDates$: Observable<Date>;

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

  constructor() {
    this.formatLabel = this.formatLabel.bind(this);
  }

  ngOnInit(): void {
    const dataSet = new Set<Date>();
    this.testData.forEach((dtStr) => dataSet.add(new Date(dtStr)));
    const uniqueDateArr = Array.from(dataSet);
    const maxDate = uniqueDateArr.reduce(function (a, b) {
      return a > b ? a : b;
    });
    const minDate = uniqueDateArr.reduce(function (a, b) {
      return a < b ? a : b;
    });
    this.sampleDates$ = from(dataSet);
    this.scope.minDate = minDate;
    this.scope.maxDate = maxDate;
    this.scope.selectedDate = new Date(this.scope.maxDate);
    this.scope.sliderRange = this.dayDiff(
      this.scope.minDate,
      this.scope.maxDate
    );
    this.value = this.max = this.scope.sliderRange;
    this.filterData(this.scope.selectedDate);
    console.log(maxDate, minDate);
  }

  get tickInterval(): number | 'auto' {
    return this.showTicks ? (this.autoTicks ? 'auto' : this._tickInterval) : 0;
  }
  set tickInterval(value) {
    this._tickInterval = coerceNumberProperty(value);
  }
  private _tickInterval = 1;

  onSliderChange(event: MatSliderChange) {
    //   console.log(event.value, this.value, this.max);
    this.scope.selectedDate = this.sliderDate(event.value, this.max);
    this.filterData(this.scope.selectedDate);
  }

  filterData(maxBoundDate: Date) {
    this.sampleDates = [];
    this.sampleDates$
      .pipe(
        map((dtStr) => new Date(dtStr)),
        filter((dt) => dt <= maxBoundDate)
      )
      .subscribe((dt) => {
        // console.log(dt);
        if (dt) this.sampleDates.push(dt);
      });
  }
  sliderDate(sliderValue: number, sliderMax: number) {
    const updatedDate = new Date(this.scope.minDate);
    return this.getFormattedDate(
      updatedDate.setTime(updatedDate.getTime() + sliderValue * 86400 * 1000)
    );
  }
  formatLabel(value: number) {
    const lbl = this.sliderDate(value, this.max);
    return new DatePipe('en-US').transform(lbl, 'shortDate');
  }

  //Util Functions
  getFormattedDate(stDate: number) {
    var sDate = new Date(stDate);
    return sDate;
  }
  dayDiff(firstDate: Date, secondDate: Date) {
    var minDate = new Date(firstDate);
    var maxDate = new Date(secondDate);
    var timeDiff = Math.abs(maxDate.getTime() - minDate.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays;
  }
}
