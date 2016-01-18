/**
 * Rect tests
**/

( function() {

var Rect = Packery.Rect;

QUnit.module('Rect');

QUnit.test( 'Rect defaults', function( assert ) {
  var rect = new Rect();
  assert.equal( rect.x, 0, 'rect.x = 0' );
  assert.equal( rect.y, 0, 'rect.y = 0' );
  assert.equal( rect.width, 0, 'rect.width = 0' );
  assert.equal( rect.height, 0, 'rect.height = 0' );
});

QUnit.test( 'set properties with initial argument object', function( assert ) {
  var rect = new Rect({
    x: 40,
    y: 390,
    width: 103,
    height: -4
  });
  assert.equal( rect.x, 40, 'x' );
  assert.equal( rect.y, 390, 'y' );
  assert.equal( rect.width, 103, 'width' );
  assert.equal( rect.height, -4, 'default height property' );
});

QUnit.test( 'contains', function( assert ) {

  var rectA = new Rect({
    x: 10,
    y: 30,
    width: 100,
    height: 400
  });

  var rectB = new Rect({
    x: 40,
    y: 60,
    width: 10,
    height: 20
  });

  assert.strictEqual( rectA.contains( rectB ), true, 'A clearly contains B' );

  rectB = new Rect({
    x: 500,
    y: 40,
    width: 40,
    height: 20
  });

  assert.strictEqual( rectA.contains( rectB ), false, 'A clearly does not contain B' );

  rectB = new Rect({
    x: 20,
    y: 40
  });

  assert.strictEqual( rectA.contains( rectB ), true,
    'A contains B, which has no width or height' );

  rectB = new Rect({
    x: 20,
    y: 50,
    width: 60,
    height: 150
  });

  assert.strictEqual( rectA.contains( rectB ), true, 'B is at upper left corner of A' );

  rectB = new Rect({
    x: rectA.x,
    y: rectA.y,
    width: rectA.width,
    height: rectA.height
  });

  assert.strictEqual( rectA.contains( rectB ), true, 'A contains B. B is equal to A' );

  rectB = new Rect({
    x: rectA.x - 20,
    y: rectA.y,
    width: rectA.width,
    height: rectA.height
  });

  assert.strictEqual( rectA.contains( rectB ), false,
    'A does not contain B. B same size A, but offset' );

});


QUnit.test( 'overlaps', function( assert ) {

  var rectA = new Rect({
    x: 100,
    y: 50,
    width: 300,
    height: 200
  });

  var rectB = new Rect({
    x: 150,
    y: 100,
    width: 100,
    height: 50
  });

  assert.strictEqual( rectA.overlaps( rectB ), true, 'B is inside A, A overlaps B' );
  assert.strictEqual( rectB.overlaps( rectA ), true, 'B is inside A, B overlaps A' );

  rectB.x = 50;

  assert.strictEqual( rectA.overlaps( rectB ), true,
    'B overlaps left edge of A, A overlaps B' );
  assert.strictEqual( rectB.overlaps( rectA ), true,
    'B overlaps left edge of A, B overlaps A' );

  rectB.y = 25;

  assert.strictEqual( rectA.overlaps( rectB ), true,
    'B overlaps left top corner of A, A overlaps B' );
  assert.strictEqual( rectB.overlaps( rectA ), true,
    'B overlaps left top corner of A, B overlaps A' );

  rectB.x = 0;
  rectB.y = 0;

  assert.strictEqual( rectA.overlaps( rectB ), false,
    'B bottom right corner meets A top left corner, A DOES NOT overlap B' );
  assert.strictEqual( rectB.overlaps( rectA ), false,
    'B bottom right corner meets A top left corner, B DOES NOT overlap A' );

  rectB.x = rectA.x - rectB.width;
  rectB.y = rectA.y;
  rectB.height = rectA.height;

  assert.strictEqual( rectA.overlaps( rectB ), false,
    'B is completely adjacent to A, A DOES NOT overlap B' );
  assert.strictEqual( rectB.overlaps( rectA ), false,
    'B is completely adjacent to A, B DOES NOT overlap A' );

});

})();
