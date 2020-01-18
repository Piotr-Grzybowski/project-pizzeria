/* global Handlebars, dataSource */ // eslint-disable-line no-unused-vars
import {Product} from './components/Product.js';
import {Cart} from './components/Cart.js';
import {Booking} from './components/Booking.js';
import {LandingPage} from './components/LandingPage.js';
import {select, settings, classNames} from './settings.js';

const app = {
  initMenu: function(){
    const thisApp = this;

    // console.log('thisApp.data:', thisApp.data);

    for (let productData in thisApp.data.products){
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },
  initData: function(){
    const thisApp = this;
    const url = settings.db.url + '/' + settings.db.product;

    thisApp.data = {};

    fetch(url)
      .then((rawResponse) => {
        return rawResponse.json();
      })
      .then((parsedResponse) => {
        console.log('parsedResponse', parsedResponse);

        // save parsedResponse as thisApp.data.products
        thisApp.data.products = parsedResponse;

        // execute initMenu method
        thisApp.initMenu();

      });

    console.log('thisApp.data', JSON.stringify(thisApp.data));
  },
  initCart: function(){
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);
    thisApp.productList.addEventListener('add-to-cart', (event) => {
      app.cart.add(event.detail.product);
    });
  },
  initPages: function(){
    const thisApp = this;

    thisApp.pages = Array.from(document.querySelector(select.containerOf.pages).children);
    thisApp.navLinks = Array.from(document.querySelectorAll(select.nav.links));

    // eslint-disable-next-line no-unused-vars
    let pagesMatchingHash = [];

    if(window.location.hash.length > 2){
      const idFromHash = window.location.hash.replace('#/', '');

      pagesMatchingHash = thisApp.pages.filter((page) => {
        return page.id === idFromHash;
      });
    }
    console.log('pages', pagesMatchingHash);
    thisApp.activatePage(pagesMatchingHash.length ? pagesMatchingHash[0].id : thisApp.pages[0].id);

    for(let link of thisApp.navLinks){
      link.addEventListener('click', (event) => {
        //const clickedElement = this;
        event.preventDefault();

        // TODO get page id from href
        let id = link.getAttribute('href').replace('#', '');

        // TODO activate page
        app.activatePage(id);
      });
    }
  },
  activatePage: function(pageId){
    const thisApp = this;
    window.location.hash = '#/' + pageId;

    for(let link of thisApp.navLinks){
      link.classList.toggle(classNames.nav.active, link.getAttribute('href') === '#' +pageId);
    }

    for(let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active, page.getAttribute('id') === pageId);
    }

  },
  initBooking: function(){
    const thisApp = this;
    const bookingWrapper = document.querySelector(select.containerOf.booking);

    thisApp.booking = new Booking(bookingWrapper);
  },
  initLandingPage: function(){
    const thisApp = this;
    const landingWrapper = document.querySelector(select.containerOf.landingPage);

    thisApp.landing = new LandingPage(landingWrapper);

    for(let link of thisApp.landing.navLinks){
      link.addEventListener('click', (event) => {
        //const clickedElement = this;
        event.preventDefault();

        // TODO get page id from href
        let id = link.getAttribute('href').replace('#', '');

        // TODO activate page
        app.activatePage(id);
      });
    }
  },
  init: function(){
    const thisApp = this;
    // console.log('*** App starting ***');
    // console.log('thisApp:', thisApp);
    // console.log('classNames:', classNames);
    // console.log('settings:', settings);
    // console.log('templates:', templates);
    thisApp.initPages();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking();
    thisApp.initLandingPage();
  },
};

app.init();

