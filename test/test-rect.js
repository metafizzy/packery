/**
 * Rect tests
**/

( function( window ) {

'use strict';

var Rect = Packery.Rect;

module('Rect');

test( 'Rect defaults', function() {
  var rect = new Rect();
  equal( rect.x, 0, 'rect.x = 0' );
  equal( rect.y, 0, 'rect.y = 0' );
  equal( rect.width, 0, 'rect.width = 0' );
  equal( rect.height, 0, 'rect.height = 0' );
});

test( 'set properties with initial argument object', function() {
  var rect = new Rect({
    x: 40,
    y: 390,
    width: 103,
    height: -4
  });
  equal( rect.x, 40, 'x' );
  equal( rect.y, 390, 'y' );
  equal( rect.width, 103, 'width' );
  equal( rect.height, -4, 'default height property' );
});



})( window );
