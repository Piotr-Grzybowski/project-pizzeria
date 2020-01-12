import {settings, select} from '../settings.js';

export class AmountWidget{
  constructor(element){
    const thisWidget = this;
    thisWidget.value = settings.amountWidget.defaultValue;

    thisWidget.getElements(element);
    thisWidget.setValue(thisWidget.input.value);
    thisWidget.initActions();

  }

  getElements(element){
    const thisWidget = this;

    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
  }

  initActions(){
    const thisWidget = this;

    thisWidget.input.addEventListener('change', thisWidget.setValue(thisWidget.input.value));
    thisWidget.linkDecrease.addEventListener('click', (event) => {
      event.preventDefault();

      thisWidget.setValue(parseInt(thisWidget.input.value) - 1);
    });
    thisWidget.linkIncrease.addEventListener('click', (event) => {
      event.preventDefault();

      thisWidget.setValue(parseInt(thisWidget.input.value) + 1);
    });
  }

  setValue(value){
    const thisWidget = this;

    const newValue = parseInt(value);

    // DONE: Add validation
    if (newValue !== thisWidget.value && newValue <= settings.amountWidget.defaultMax && newValue >= settings.amountWidget.defaultMin){

      thisWidget.value = newValue;
      thisWidget.announce();

    }

    thisWidget.input.value = thisWidget.value;
  }

  announce(){
    const thisWidget = this;

    const event = new Event('updated', {bubbles: true});
    thisWidget.element.dispatchEvent(event);
  }

}
