/**
 * Packery tests
 */

( function( window ) {

'use strict';


module('Packery');

test( 'basics', function() {
  equal( typeof Packery === 'function', true, 'Packery is a function' );
});

test( 'getItems', function() {
  var ex1 = document.getElementById('ex1');
  var pack1 = new Packery( ex1, {
    itemSelector: '.item'
  });

  equal( pack1.items.length, 6, 'filtered, itemSelector = .item, not all children' );

  var ex2 = document.getElementById('ex2');
  var pack2 = new Packery( ex2, {
    itemSelector: '.item'
  });

  equal( pack2.items.length, 4, 'found itemSelector = .item, querySelectoring' );

});

})( window );
