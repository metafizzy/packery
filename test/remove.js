( function() {

'use strict';

test( 'remove', function() {
  var container = document.querySelector('#add-remove');
  // packery starts with 4 items
  var pckry = new Packery( container, {
    itemSelector: '.item'
  });
  // remove two items
  var w2Elems = container.querySelectorAll('.w2');
  pckry.on( 'removeComplete', function( obj, removedItems ) {
    equal( true, true, 'removeComplete event did fire' );
    equal( obj, pckry, 'event-emitted argument matches Packery instance' );
    equal( removedItems.length, w2Elems.length, 'remove elems length matches 2nd argument length' );
    for ( var i=0, len = removedItems.length; i < len; i++ ) {
      equal( removedItems[i].element, w2Elems[i], 'removedItems element matches' );
    }
    equal( container.children.length, 2, 'elements removed from DOM' );
    equal( container.querySelectorAll('.w2').length, 0, 'matched elements were removed' );
    start();
  });
  stop();
  pckry.remove( w2Elems );
  equal( pckry.items.length, 2, 'items removed from Packery instance' );

});

})();

