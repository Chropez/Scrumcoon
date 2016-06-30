/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'scrumcoon',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    firebase: {
      apiKey: "AIzaSyAJJnvmt79PthO8ZrscAZIj357S6sdRahc",
      authDomain: "scrumcoon.firebaseapp.com",
      databaseURL: "https://scrumcoon.firebaseio.com",
      storageBucket: "scrumcoon.appspot.com"
    },

    contentSecurityPolicy: {
      'default-src': "'none'",
      'frame-src': "self' https://*.firebaseapp.com",
      'font-src': "'self' http://fonts.gstatic.com",
      'script-src': "'self' 'unsafe-eval' apis.google.com",
      'connect-src': "'self' wss://*.firebaseio.com https://*.googleapis.com",
      'img-src': "'self' data:",
      'media-src': "'self'"
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
