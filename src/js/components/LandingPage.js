import { templates } from '../settings.js';
import { utils } from '../utils.js';

export class LandingPage {
  constructor(wrapper) {
    const thisLandingPage = this;

    // thisLandingPage.initCarousel();
    thisLandingPage.render(wrapper);
  }

  render(wrapper) {
    const thisLandingPage = this;

    const generatedHTML = templates.landingPage();

    thisLandingPage.wrapper = wrapper;

    thisLandingPage.wrapper.appendChild(utils.createDOMFromHTML(generatedHTML));
  }
}
