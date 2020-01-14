import { select, templates, settings, classNames } from '../settings.js';
import { utils } from '../utils.js';
import { AmountWidget } from './AmountWidget.js';
import { DatePicker } from './DatePicker.js';
import { HourPicker } from './HourPicker.js';

export class Booking {
  constructor(bookingWrapper) {
    const thisBooking = this;
    thisBooking.render(bookingWrapper);
    thisBooking.initWidgets();
    thisBooking.getData();
  }

  getData() {
    const thisBooking = this;

    const startEndDates = {};
    startEndDates[settings.db.dateStartParamKey] = utils.dateToStr(
      thisBooking.datePicker.minDate
    );
    startEndDates[settings.db.dateEndParamKey] = utils.dateToStr(
      thisBooking.datePicker.maxDate
    );

    const endDate = {};
    endDate[settings.db.dateEndParamKey] =
      startEndDates[settings.db.dateEndParamKey];

    const params = {
      booking: utils.queryParams(startEndDates),
      eventsCurrent:
        settings.db.notRepeatParam + '&' + utils.queryParams(startEndDates),
      eventsRepeat: settings.db.repeatParam + '&' + utils.queryParams(endDate)
    };

    const urls = {
      booking:
        settings.db.url + '/' + settings.db.booking + '?' + params.booking,
      eventsCurrent:
        settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent,
      eventsRepeat:
        settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat
    };

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat)
    ])
      .then(function([
        bookingResponse,
        eventsCurrentResponse,
        eventsRepeatResponse
      ]) {
        return Promise.all([
          bookingResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json()
        ]);
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]) {
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });

    console.log('getData params ', params);
  }

  render(wrapper) {
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};

    thisBooking.dom.wrapper = wrapper;

    thisBooking.dom.wrapper.appendChild(utils.createDOMFromHTML(generatedHTML));

    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(
      select.booking.peopleAmount
    );
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(
      select.booking.hoursAmount
    );
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(
      select.widgets.datePicker.wrapper
    );
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(
      select.widgets.hourPicker.wrapper
    );
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
    thisBooking.dom.wrapper,addEventListener('updated', () => {
      thisBooking.updateDOM();
    });
  }

  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;
    thisBooking.booked = {};

    for (let eventCurrent of eventsCurrent) {
      thisBooking.makeBooked(
        eventCurrent.date,
        eventCurrent.hour,
        eventCurrent.duration,
        eventCurrent.table
      );
    }

    for (let booking of bookings) {
      thisBooking.makeBooked(
        booking.date,
        booking.hour,
        booking.duration,
        booking.table
      );
    }

    const maxDateStr = utils.dateToStr(thisBooking.datePicker.maxDate);
    const minDateStr = utils.dateToStr(thisBooking.datePicker.minDate);

    for (let eventRepeat of eventsRepeat) {
      if (eventRepeat.date < minDateStr) {
        for (
          let i = minDateStr;
          i <= maxDateStr;
          i = utils.dateToStr(utils.addDays(i, 1))
        ) {
          thisBooking.makeBooked(
            i,
            eventRepeat.hour,
            eventRepeat.duration,
            eventRepeat.table
          );
        }
      } else {
        for (
          let i = eventRepeat.date;
          i <= maxDateStr;
          i = utils.dateToStr(utils.addDays(i, 1))
        ) {
          thisBooking.makeBooked(
            i,
            eventRepeat.hour,
            eventRepeat.duration,
            eventRepeat.table
          );
        }
      }
    }
    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table) {
    const thisBooking = this;
    const startTime = utils.hourToNumber(hour);
    const endTime = utils.hourToNumber(hour) + duration;

    for (let i = startTime; i < endTime; i += 0.5) {
      if (thisBooking.booked.hasOwnProperty(date)) {
        if (thisBooking.booked[date].hasOwnProperty(i)) {
          thisBooking.booked[date][i].push(table);
        } else Object.assign(thisBooking.booked[date], { [i]: [table] });
      } else {
        thisBooking.booked[date] = {
          [i]: [table]
        };
      }
    }
  }

  updateDOM() {
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    for (let table of thisBooking.dom.tables) {
      const tableNumber = table.getAttribute(settings.booking.tableIdAttribute);

      if (thisBooking.booked[thisBooking.date] && thisBooking.booked[thisBooking.date][thisBooking.hour] && thisBooking.booked[thisBooking.date][thisBooking.hour].indexOf(parseInt(tableNumber)) !== -1) {
        table.classList.add(classNames.booking.tableBooked);
        console.log('-----------------------------------------------------');
      }
      else table.classList.remove(classNames.booking.tableBooked);
    }
  }
}
