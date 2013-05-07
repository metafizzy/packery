( function() {

'use strict';

module('Packery');

test( 'basics', function() {
  equal( typeof Packery, 'function', 'Packery is a function' );
  // TODO pckry should be null or something
  var pckry1 = new Packery();
  // console.log( pckry, typeof pckry );
  ok( !pckry1._isLayoutInited, 'packery not inited on undefined' );

  var pckry2 = new Packery({});
  // console.log( pckry, typeof pckry );
  ok( !pckry2._isLayoutInited, 'packery not inited on object' );
});

})();
