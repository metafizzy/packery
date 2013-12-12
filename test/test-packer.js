/**
 * Packer tests
 */

( function( window ) {

'use strict';


module('Packer');

var Packery = window.Packery;
var Packer = Packery.Packer;
var Rect = Packery.Rect;

test( 'basics', function() {
  equal( typeof Packer === 'function', true, 'Packery is a function' );
});

test( 'packing', function() {
  var packr = new Packer( 3, 10 );

  // 112
  // 352
  // 344
  // xxx
  // xxx

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

  // bottom space is open
  equal( packr.spaces.length, 1, 'one space open' );
  var space = packr.spaces[0];
  equal( space.width, 3, 'space.width' );
  equal( space.height, 7, 'space.height' );
  equal( space.x, 0, 'space.x' );
  equal( space.y, 3, 'space.y' );

});
test( 'packing with a placed', function() {
  var packr = new Packer( 3, 10 );

  // 225
  // 311
  // 34x
  // x4x
  // xxx
  // xxx

  var rect1 = new Rect({
    width: 2,
    height: 1,
    x: 1,
    y: 1
  });
  var rect2 = new Rect({ width: 2, height: 1 });
  var rect3 = new Rect({ width: 1, height: 2 });
  var rect4 = new Rect({ width: 1, height: 2 });
  var rect5 = new Rect({ width: 1, height: 1 });

  packr.placed( rect1 );
  packr.pack( rect2 );
  packr.pack( rect3 );
  packr.pack( rect4 );
  packr.pack( rect5 );

  equal( rect2.x, 0, 'rect2.x top left' );
  equal( rect2.y, 0, 'rect2.y top left' );
  equal( rect3.x, 0, 'rect3.x left side' );
  equal( rect3.y, 1, 'rect3.y left side' );
  equal( rect4.x, 1, 'rect4.x bottom center' );
  equal( rect4.y, 2, 'rect4.y bottom center' );
  equal( rect5.x, 2, 'rect5.x packed in top right' );
  equal( rect5.y, 0, 'rect5.y packed in top right' );

  equal( packr.spaces.length, 3, '3 spaces left' );

});

test( 'packing horizontal', function() {

  function checkRect( rect, x, y ) {
    equal( rect.x, x, 'x: ' + x );
    equal( rect.y, y, 'y: ' + y );
  }

  var packr = new Packer( 10, 3, 'rightwardTopToBottom' );

  // 133xx
  // 154xx
  // 224xx

  var rect1 = new Rect({ width: 1, height: 2 });
  var rect2 = new Rect({ width: 2, height: 1 });
  var rect3 = new Rect({ width: 2, height: 1 });
  var rect4 = new Rect({ width: 1, height: 2 });
  var rect5 = new Rect({ width: 1, height: 1 });

  packr.pack( rect1 );
  packr.pack( rect2 );
  packr.pack( rect3 );
  packr.pack( rect4 );
  packr.pack( rect5 );

  checkRect( rect1, 0, 0 );
  checkRect( rect2, 0, 2 );
  checkRect( rect3, 1, 0 );
  checkRect( rect4, 2, 1 );
  checkRect( rect5, 1, 1 );

  // bottom space is open
  equal( packr.spaces.length, 1, 'one space open' );
  var space = packr.spaces[0];
  equal( space.width, 7, 'space.width' );
  equal( space.height, 3, 'space.height' );
  checkRect( space, 3, 0 );

});

})( window );
