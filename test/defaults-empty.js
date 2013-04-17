( function() {

'use strict';

test( 'defaults / empty', function() {
  var empty = document.querySelector('#empty');
  var pckry = new Packery( empty );
  deepEqual( pckry.options, Packery.prototype.options, 'default options match prototype' );
  equal( pckry.items.length, 0, 'zero items' );
  equal( pckry.stampedElements.length, 0, 'zero stamped elements' );
  equal( Packery.data( empty ), pckry, 'data method returns instance' );
  ok( pckry.isResizeBound, 'isResizeBound' );
});

})();
