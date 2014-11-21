/*global requirejs: false*/

/*
// bower components
requirejs.config({
  baseUrl: '../bower_components'
});

requirejs( [ '../js/packery' ], function( Packery ) {

  new Packery( document.querySelector('#basic') );

});
// */

/*
// packery.pkgd.js
requirejs( [
  'js/packery.pkgd.js',
  'require'
], function( pkgd, require ) {
  require( ['packery/js/packery'], function ( Packery ) {
    new Packery('#basic');
  });
});
// */

requirejs( [
  'js/packery.pkgd.js'
], function( Packery ) {
  new Packery('#basic');
});
