import {AmountWidget} from './AmountWidget.js';
import {utils} from '../utils.js';
import {select, classNames, templates} from '../settings.js';

export class Product{
  constructor(id, data){
    const thisProduct = this;
    thisProduct.id = id;
    thisProduct.data = data;
    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
  }

  addToCart(){
    const thisProduct = this;

    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;

    // app.cart.add(thisProduct);

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });

    thisProduct.element.dispatchEvent(event);
  }

  renderInMenu(){
    const thisProduct = this;

    // generate HTML based on template
    const generatedHTML = templates.menuProduct(thisProduct.data);

    // create element using utils.createElementFromHTML
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);

    // find menu container
    const menuContainer = document.querySelector(select.containerOf.menu);

    // add element to menu
    menuContainer.appendChild(thisProduct.element);
  }

  getElements(){
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }

  initAccordion(){
    const thisProduct = this;

    /* START: click event listener to trigger */
    thisProduct.accordionTrigger.addEventListener('click', (event) => {

      /* prevent default action for event */
      event.preventDefault();

      /* toggle active class on element of thisProduct */
      thisProduct.element.classList.add('active');

      /* find all active products */
      const activeProducts = document.querySelectorAll(select.all.menuProductsActive);

      /* START LOOP: for each active product */
      for (let activeProduct of activeProducts) {

        /* START: if the active product isn't the element of thisProduct */
        if (activeProduct != thisProduct.element) {

          /* remove class active for the active product */
          activeProduct.classList.remove('active');

        /* END: if the active product isn't the element of thisProduct */
        }

      /* END LOOP: for each active product */
      }

      /* END: click event listener to trigger */
    });
  }

  initOrderForm(){
    const thisProduct = this;

    thisProduct.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisProduct.processOrder();
    });

    for(let input of thisProduct.formInputs){
      input.addEventListener('change', function(){
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function(event){
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }

  processOrder(){
    const thisProduct = this;

    thisProduct.params = {};

    // set variable price equal to thisProduct.data.price
    let price = thisProduct.data.price;

    const visible = classNames.menuProduct.imageVisible; // class that makes image visible

    const formData = utils.serializeFormToObject(thisProduct.form);

    for (let param in thisProduct.data.params) {
      for (let option in thisProduct.data.params[param].options) {
        const isSelected = formData.hasOwnProperty(param) && formData[param].indexOf(option) > -1; // if option selected
        const isDefault = thisProduct.data.params[param].options[option].default == true; // if option default
        const optionPrice = thisProduct.data.params[param].options[option].price; // price of option
        const image = thisProduct.imageWrapper.querySelector('.'+ param + '-' + option); // option's image
        const thisParam = thisProduct.data.params[param]; // current parameter
        const thisOption = thisProduct.data.params[param].options[option]; // current option

        // if option clicked and not default
        if (isSelected && !isDefault) {
          price += optionPrice;
        }
        // if option default and unclicked
        else if (!isSelected && isDefault) {
          price -= optionPrice;
        }
        // If option have an image
        if (image) {
          // if option selected
          if (isSelected) {
            // add selected option to thisProduct.params
            if(!thisProduct.params[param]){
              thisProduct.params[param] = {
                label: thisParam.label,
                options: {},
              };
            }
            thisProduct.params[param].options[option] = thisOption.label;

            //  show image of option
            image.classList.add(visible);
          }
          // if option not selected hide image of option
          else image.classList.remove(visible);
        }
      }
    }
    // multiply price by amount
    thisProduct.priceSingle = price;
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;

    thisProduct.priceElem.innerHTML = thisProduct.price;

  }

  initAmountWidget(){
    const thisProduct = this;
    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);

    thisProduct.amountWidgetElem.addEventListener('updated', () => {
      thisProduct.processOrder();
    });
  }
}
