/**
 * Packer tests
 */

( function() {

QUnit.module('Packer');

var Packer = Packery.Packer;
var Rect = Packery.Rect;

QUnit.test( 'basics', function( assert ) {
  assert.equal( typeof Packer === 'function', true, 'Packery is a function' );
});

QUnit.test( 'packing', function( assert ) {
  var packr = new Packer( 30, 100 );

  // 112
  // 352
  // 344
  // xxx
  // xxx

  var rect1 = new Rect({ width: 20, height: 10 });
  var rect2 = new Rect({ width: 10, height: 20 });
  var rect3 = new Rect({ width: 10, height: 20 });
  var rect4 = new Rect({ width: 20, height: 10 });
  var rect5 = new Rect({ width: 10, height: 10 });

  packr.pack( rect1 );
  packr.pack( rect2 );
  packr.pack( rect3 );
  packr.pack( rect4 );
  packr.pack( rect5 );

  assert.equal( rect1.x, 0, 'rect1.x top left' );
  assert.equal( rect1.y, 0, 'rect1.y top left' );
  assert.equal( rect2.x, 20, 'rect2.x top right' );
  assert.equal( rect2.y, 0, 'rect2.y top right' );
  assert.equal( rect3.x, 0, 'rect3.x bottom left' );
  assert.equal( rect3.y, 10, 'rect3.y bottom left' );
  assert.equal( rect4.x, 10, 'rect4.x bottom right' );
  assert.equal( rect4.y, 20, 'rect4.y bottom right' );
  assert.equal( rect5.x, 10, 'rect5.x packed in center' );
  assert.equal( rect5.y, 10, 'rect5.y packed in center' );

  // bottom space is open
  assert.equal( packr.spaces.length, 1, 'one space open' );
  var space = packr.spaces[0];
  assert.equal( space.width, 30, 'space.width' );
  assert.equal( space.height, 70, 'space.height' );
  assert.equal( space.x, 0, 'space.x' );
  assert.equal( space.y, 30, 'space.y' );

});
QUnit.test( 'packing with a placed', function( assert ) {
  var packr = new Packer( 30, 100 );

  // 225
  // 311
  // 34x
  // x4x
  // xxx
  // xxx

  var rect1 = new Rect({
    width: 20,
    height: 10,
    x: 10,
    y: 10
  });
  var rect2 = new Rect({ width: 20, height: 10 });
  var rect3 = new Rect({ width: 10, height: 20 });
  var rect4 = new Rect({ width: 10, height: 20 });
  var rect5 = new Rect({ width: 10, height: 10 });

  packr.placed( rect1 );
  packr.pack( rect2 );
  packr.pack( rect3 );
  packr.pack( rect4 );
  packr.pack( rect5 );

  assert.equal( rect2.x, 0, 'rect2.x top left' );
  assert.equal( rect2.y, 0, 'rect2.y top left' );
  assert.equal( rect3.x, 0, 'rect3.x left side' );
  assert.equal( rect3.y, 10, 'rect3.y left side' );
  assert.equal( rect4.x, 10, 'rect4.x bottom center' );
  assert.equal( rect4.y, 20, 'rect4.y bottom center' );
  assert.equal( rect5.x, 20, 'rect5.x packed in top right' );
  assert.equal( rect5.y, 0, 'rect5.y packed in top right' );

  assert.equal( packr.spaces.length, 3, '3 spaces left' );

});

QUnit.test( 'packing horizontal', function( assert ) {

  function checkRect( rect, x, y ) {
    assert.equal( rect.x, x, 'x: ' + x );
    assert.equal( rect.y, y, 'y: ' + y );
  }

  var packr = new Packer( 100, 30, 'rightwardTopToBottom' );

  // 133xx
  // 154xx
  // 224xx

  var rect1 = new Rect({ width: 10, height: 20 });
  var rect2 = new Rect({ width: 20, height: 10 });
  var rect3 = new Rect({ width: 20, height: 10 });
  var rect4 = new Rect({ width: 10, height: 20 });
  var rect5 = new Rect({ width: 10, height: 10 });

  packr.pack( rect1 );
  packr.pack( rect2 );
  packr.pack( rect3 );
  packr.pack( rect4 );
  packr.pack( rect5 );

  checkRect( rect1, 0, 0 );
  checkRect( rect2, 0, 20 );
  checkRect( rect3, 10, 0 );
  checkRect( rect4, 20, 10 );
  checkRect( rect5, 10, 10 );

  // bottom space is open
  assert.equal( packr.spaces.length, 1, 'one space open' );
  var space = packr.spaces[0];
  assert.equal( space.width, 70, 'space.width' );
  assert.equal( space.height, 30, 'space.height' );
  checkRect( space, 30, 0 );

});

})();
