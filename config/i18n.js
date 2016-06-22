/**
 * Internationalization / Localization Settings
 * (sails.config.i18n)
 *
 * If your app will touch people from all over the world, i18n (or internationalization)
 * may be an important part of your international strategy.
 *
 *
 * For more informationom i18n in Sails, check out:
 * http://sailsjs.org/#!/documentation/concepts/Internationalization
 *
 * For a complete list of i18n options, see:
 * https://github.com/mashpie/i18n-node#list-of-configuration-options
 *
 *
 */

module.exports.i18n = {

  /***************************************************************************
  *                                                                          *
  * Which locales are supported?                                             *
  *                                                                          *
  ***************************************************************************/

  locales: ['en', 'es', 'fr', 'pt', 'de'],

  /****************************************************************************
  *                                                                           *
  * What is the default locale for the site? Note that this setting will be   *
  * overridden for any request that sends an "Accept-Language" header (i.e.   *
  * most browsers), but it's still useful if you need to localize the         *
  * response for requests made by non-browser clients (e.g. cURL).            *
  *                                                                           *
  ****************************************************************************/

  defaultLocale: 'es',

  /****************************************************************************
  *                                                                           *
  * Automatically add new keys to locale (translation) files when they are    *
  * encountered during a request?                                             *
  *                                                                           *
  ****************************************************************************/

  updateFiles: true,

  /****************************************************************************
  *                                                                           *
  * Path (relative to app root) of directory to store locale (translation)    *
  * files in.                                                                 *
  *                                                                           *
  ****************************************************************************/

  localesDirectory: '/config/locales',

  objectNotation: true,


  // sets a custom cookie name to parse locale settings from - defaults to NULL
  cookie: 'rtcookie',

  // query parameter to switch locale (ie. /home?lang=ch) - defaults to NULL
  queryParameter: 'lang',

  // where to store json files - defaults to './locales' relative to modules directory
  directory: './config/locales',

  // controll mode on directory creation - defaults to NULL which defaults to umask of process user. Setting has no effect on win.
  directoryPermissions: '755',

  // watch for changes in json files to reload locale on updates - defaults to false
  autoReload: true,

  // what to use as the indentation unit - defaults to "\t"
  indent: "\t",

  // setting extension of json files - defaults to '.json' (you might want to set this to '.js' according to webtranslateit)
  extension: '.json',

  // setting prefix of json files name - default to none '' (in case you use different locale files naming scheme (webapp-en.json), rather then just en.json)
  prefix: '',

  // enable object notation
  objectNotation: false,

  // setting of log level DEBUG - default to require('debug')('i18n:debug')
  logDebugFn: function (msg) {
    console.log('debug', msg);
  },

  // setting of log level WARN - default to require('debug')('i18n:warn')
  logWarnFn: function (msg) {
    console.log('warn', msg);
  },

  // setting of log level ERROR - default to require('debug')('i18n:error')
  logErrorFn: function (msg) {
    console.log('error', msg);
  },

  // object or [obj1, obj2] to bind the i18n api and current locale to - defaults to null
  register: global


};
