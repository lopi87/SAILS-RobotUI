/**
 * grunt/pipeline.js
 *
 * The order in which your css, javascript, and template files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files.)
 */



// CSS files to inject in order
//
// (if you're using LESS with the built-in default config, you'll want
//  to change `assets/styles/importer.less` instead.)
var cssFilesToInject = [

  'styles/bootstrap/bootstrap.css',
  'styles/bootstrap/bootstrap-theme.css',
  'styles/jasny-bootstrap/jasny-bootstrap.css',
  'styles/bootstrap-colorpicker/bootstrap-colorpicker.css',
  'styles/font-awesome/font-awesome.css',
  'styles/parsley/parsley.css',
  'styles/jquery-ui/jquery-ui.css',
  'styles/summernote/summernote.css',
  'styles/summernote/summernote-bs3.css',
  'styles/base/*.scss',



  'styles/**/*.css'
];


// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [

  // Load sails.io before everything else
  'js/dependencies/sails.io.js',

  // Dependencies like jQuery, or Angular are brought in here
  'js/vendor/jquery-2.2.4.js',
  'js/vendor/bootstrap.js',
  'js/vendor/chosen.jquery.js',
  'js/vendor/ImageSelect.jquery.js',
  'js/vendor/jasny-bootstrap.js',
  'js/vendor/interact.js',
  'js/vendor/bootstrap-colorpicker.js',
  'js/vendor/jquery-ui.js',
  'js/vendor/parsley.js',
  'js/vendor/summernote.min.js',
  'js/i18n/*.js',  //languages of parsley

  'js/vendor/**/*.js',
  'js/utils.js',


  // All of the rest of your client-side js files
  // will be injected here in no particular order.
  'js/**/*.js'
];


// Client-side HTML templates are injected using the sources below
// The ordering of these templates shouldn't matter.
// (uses Grunt-style wildcard/glob/splat expressions)
//
// By default, Sails uses JST templates and precompiles them into
// functions for you.  If you want to use jade, handlebars, dust, etc.,
// with the linker, no problem-- you'll just want to make sure the precompiled
// templates get spit out to the same file.  Be sure and check out `tasks/README.md`
// for information on customizing and installing new tasks.
var templateFilesToInject = [
  'templates/**/*.html'
];



// Prefix relative paths to source files so they point to the proper locations
// (i.e. where the other Grunt tasks spit them out, or in some cases, where
// they reside in the first place)
module.exports.cssFilesToInject = cssFilesToInject.map(function(path) {
  return '.tmp/public/' + path;
});
module.exports.jsFilesToInject = jsFilesToInject.map(function(path) {
  return '.tmp/public/' + path;
});
module.exports.templateFilesToInject = templateFilesToInject.map(function(path) {
  return 'assets/' + path;
});
