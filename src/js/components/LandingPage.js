/* global Glide */
import { select, templates } from '../settings.js';
import { utils } from '../utils.js';


export class LandingPage {
  constructor(wrapper) {
    const thisLandingPage = this;
    thisLandingPage.render(wrapper);
    thisLandingPage.getLinks();
    thisLandingPage.initPlugin();
  }

  getLinks() {
    const thisLandingPage = this;
    thisLandingPage.navLinks = Array.from(thisLandingPage.wrapper.querySelectorAll(select.nav.landingLinks));
  }

  render(wrapper) {
    const thisLandingPage = this;

    const generatedHTML = templates.landingPage();

    thisLandingPage.wrapper = wrapper;

    thisLandingPage.wrapper.appendChild(utils.createDOMFromHTML(generatedHTML));
  }

  initPlugin() {
    const thisLandingPage = this;

    const carousel = thisLandingPage.wrapper.querySelector('.glide');
    const options = {
      type: 'carousel',
      autoplay: 3000,
      animationDuration: 1500,
      startAt: 1,
      hoverpause: true
    };

    if (carousel) {
      const glide = new Glide(carousel, options);
      glide.mount();
    }
  }
}
