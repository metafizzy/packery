( function() {

'use strict';

test( 'defaults / empty', function() {
  var empty = document.querySelector('#empty');
  var pckry = new Packery( empty );
  deepEqual( pckry.options, Packery.defaults, 'default options match prototype' );
  equal( pckry.items.length, 0, 'zero items' );
  equal( pckry.stamps.length, 0, 'zero stamped elements' );
  equal( Packery.data( empty ), pckry, 'data method returns instance' );
  ok( pckry.isResizeBound, 'isResizeBound' );

  pckry.on( 'layoutComplete', function( obj, items ) {
    ok( true, 'layoutComplete triggered with no items' );
    equal( items.length, 0, 'no items' );
    start();
    return true; // bind once
  });
  stop();
  // add gutter, to check that container size doesn't get negative number
  pckry.options.gutter = 20;
  pckry.layout();
});

})();
