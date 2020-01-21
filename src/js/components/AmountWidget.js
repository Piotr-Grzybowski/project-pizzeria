import {settings, select} from '../settings.js';
import {BaseWidget} from './BaseWidget.js';

export class AmountWidget extends BaseWidget {
  constructor(wrapper, stepValue, minValue) {
    super(wrapper, settings.amountWidget.defaultValue);

    const thisWidget = this;

    thisWidget.stepValue = stepValue || 1;
    thisWidget.maxValue = settings.amountWidget.defaultMax;
    thisWidget.minValue = minValue || settings.amountWidget.defaultMin;
    thisWidget.getElements();
    thisWidget.initActions();
    thisWidget.renderValue();
  }

  parseValue(newValue) {
    return parseFloat(newValue);
  }

  getElements(){
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }

  isValid(newValue){
    const thisWidget = this;

    return !isNaN(newValue) && newValue >= thisWidget.minValue && newValue <= thisWidget.maxValue;
  }

  initActions(){
    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', () => {
      thisWidget.value = thisWidget.dom.input.value;
    });

    thisWidget.dom.linkDecrease.addEventListener('click', (event) => {
      event.preventDefault();
      thisWidget.value = (thisWidget.parseValue(thisWidget.dom.input.value) - thisWidget.stepValue);
    });

    thisWidget.dom.linkIncrease.addEventListener('click', (event) => {
      event.preventDefault();
      thisWidget.value = (thisWidget.parseValue(thisWidget.dom.input.value) + thisWidget.stepValue);
    });
  }

  renderValue(){
    const thisWidget = this;

    thisWidget.dom.input.value = thisWidget.value;
  }

}
