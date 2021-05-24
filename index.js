const
  fs = require('fs'),
  handlebars = require('handlebars'),
  handlebarsWax = require('handlebars-wax'),
  addressFormat = require('address-format'),
  moment = require('moment'),
  Swag = require('swag');

Swag.registerHelpers(handlebars);

handlebars.registerHelper({
  removeProtocol: function (url) {
    return url.replace(/.*?:\/\//g, '');
  },

  concat: function () {
    let res = '';

    for (let arg in arguments) {
      if (typeof arguments[arg] !== 'object') {
        res += arguments[arg];
      }
    }

    return res;
  },

  formatAddress: function (address, city, region, postalCode, countryCode) {
    let addressList = addressFormat({
      address: address,
      city: city,
      subdivision: region,
      postalCode: postalCode,
      countryCode: countryCode
    });


    return addressList.join('<br/>');
  },

  isArray: function(obj) {
    return Array.isArray(obj);
  },

  formatTechnologies: function(technologies) {
    return technologies.join(', ');
  },

  formatDate: function (date) {
    return moment(date).format('MMM YYYY');
  },

  formatDuration: function (startDate, endDate) {
    const start = moment(startDate);
    const end = moment(endDate || new Date().toISOString());
    const years = end.diff(start, 'years');
    const monthsAccounted = years * 12;
    const totalMonths = end.diff(start, 'month');
    const months = totalMonths - monthsAccounted;

    let duration = '';
    if (years > 0) {
      duration += `${years} year${years > 1 ? 's' : ''}`;
    }
    if (months > 0) {
      if (duration !== '') {
        duration += ' ';
      }
      duration += `${months} month${months > 1 ? 's' : ''}`;
    }

    return duration;
  }
});


function render(resume) {
  let dir = __dirname + '/public',
    css = fs.readFileSync(dir + '/styles/main.css', 'utf-8'),
    resumeTemplate = fs.readFileSync(dir + '/views/resume.hbs', 'utf-8');

  let Handlebars = handlebarsWax(handlebars);

  Handlebars.partials(dir + '/views/partials/**/*.{hbs,js}');
  Handlebars.partials(dir + '/views/components/**/*.{hbs,js}');

  return Handlebars.compile(resumeTemplate)({
    css: css,
    resume: resume
  });
}

module.exports = {
  render: render
};
