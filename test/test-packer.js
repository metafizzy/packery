/**
 * Packer tests
 */

( function( window ) {

'use strict';


module('Packer');

var Packer = Packery.Packer;
var Rect = Packery.Rect;

test( 'basics', function() {
  equal( typeof Packer === 'function', true, 'Packery is a function' );
});

test( 'placements', function() {
  var packr = new Packer( 3, 10 );
  var rect1 = new Rect({ width: 2, height: 1 });
  var rect2 = new Rect({ width: 1, height: 2 });
  var rect3 = new Rect({ width: 1, height: 2 });
  var rect4 = new Rect({ width: 2, height: 1 });
  var rect5 = new Rect({ width: 1, height: 1 });

  packr.pack( rect1 );
  packr.pack( rect2 );
  packr.pack( rect3 );
  packr.pack( rect4 );
  packr.pack( rect5 );

  equal( rect1.x, 0, 'rect1.x top left' );
  equal( rect1.y, 0, 'rect1.y top left' );
  equal( rect2.x, 2, 'rect2.x top right' );
  equal( rect2.y, 0, 'rect2.y top right' );
  equal( rect3.x, 0, 'rect3.x bottom left' );
  equal( rect3.y, 1, 'rect3.y bottom left' );
  equal( rect4.x, 1, 'rect4.x bottom right' );
  equal( rect4.y, 2, 'rect4.y bottom right' );
  equal( rect5.x, 1, 'rect5.x packed in center' );
  equal( rect5.y, 1, 'rect5.y packed in center' );

});

})( window );
