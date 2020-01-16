/* global Glide */
import { templates } from '../settings.js';
import { utils } from '../utils.js';


export class LandingPage {
  constructor(wrapper) {
    const thisLandingPage = this;
    thisLandingPage.render(wrapper);
    thisLandingPage.initCarousel();
  }

  render(wrapper) {
    const thisLandingPage = this;

    const generatedHTML = templates.landingPage();

    thisLandingPage.wrapper = wrapper;

    thisLandingPage.wrapper.appendChild(utils.createDOMFromHTML(generatedHTML));
  }

  initCarousel() {
    const thisLandingPage = this;

    const slider = thisLandingPage.wrapper.querySelector('.glide');
    const options = {
      type: 'carousel',
      autoplay: 3000,
      animationDuration: 1500,
      startAt: 1,
    };

    if (slider) {
      const glide = new Glide(slider, options);
      glide.mount();
    }
  }
}
