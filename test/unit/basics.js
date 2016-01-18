QUnit.module('Packery');

QUnit.test( 'basics', function( assert ) {
  assert.equal( typeof Packery, 'function', 'Packery is a function' );
  // TODO pckry should be null or something
  var pckry1 = new Packery();
  // console.log( pckry, typeof pckry );
  assert.ok( !pckry1._isLayoutInited, 'packery not inited on undefined' );

  // var pckry2 = new Packery({});
  // console.log( pckry, typeof pckry );
  // FIXME Outlayer should throw error up top
  // assert.ok( !pckry2._isLayoutInited, 'packery not inited on object' );
});
