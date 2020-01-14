/* global flatpickr */
import { BaseWidget } from './BaseWidget.js';
import { utils } from '../utils.js';
import { select, settings } from '../settings.js';

export class DatePicker extends BaseWidget{
  constructor(wrapper){
    super(wrapper, utils.dateToStr(new Date()));
    const thisWidget = this;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    thisWidget.initPlugin();
  }

  initPlugin(){
    const thisWidget = this;

    thisWidget.minDate = new Date(thisWidget.value);
    thisWidget.maxDate = utils.addDays(thisWidget.minDate, settings.datePicker.maxDaysInFuture);

    console.log('todayDate', thisWidget.minDate.getDate());


    flatpickr(thisWidget.dom.input, {
      defaultDate: thisWidget.minDate.getDay() === 1 ? utils.addDays(utils.dateToStr(thisWidget.minDate), 1) : thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,
      locale: {
        'firstDayOfWeek': 1,
      },
      disable: [(date) => {
        return (date.getDay() === 1);
      }],
      // eslint-disable-next-line no-unused-vars
      onChange: (selectedDates, dateStr, instance) => {
        thisWidget.value = dateStr;
      }
    });
  }

  parseValue(newValue){
    return newValue;
  }

  // eslint-disable-next-line no-unused-vars
  isValid(newValue){
    return true;
  }

  renderValue(){

  }
}
