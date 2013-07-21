( function() {

'use strict';

test( 'layout', function() {
  var container = document.querySelector('#layout');
  var pckry = new Packery( container );
  var elem0 = pckry.items[0].element;
  var elem1 = pckry.items[1].element;
  var elem2 = pckry.items[2].element;

  equal( elem0.style.left, '0px', 'first item left' );
  equal( elem0.style.top, '0px', 'first item left' );
  equal( elem1.style.left, '40px', '2nd item, 2nd column' );
  equal( elem1.style.top, '0px', '2nd item top' );
  equal( elem2.style.left, '0px', '3rd item, left' );
  equal( elem2.style.top, '20px', '3rd item, 2nd row' );
  equal( container.style.height, '60px', 'height set' );

  // change size of elems to change layout
  elem0.style.width = '18px';
  pckry.items[3].element.style.height = '58px';
  var items = pckry._getItemsForLayout( pckry.items );
  pckry.on( 'layoutComplete', function( obj, completeItems ) {
    equal( true, true, 'layoutComplete event did fire' );
    equal( obj, pckry, 'event-emitted argument matches Packery instance' );
    equal( completeItems.length, items.length, 'event-emitted items matches layout items length' );
    strictEqual( completeItems[0], items[0], 'event-emitted items has same first item' );
    var len = completeItems.length - 1;
    strictEqual( completeItems[ len ], items[ len ], 'event-emitted items has same last item' );
    equal( elem1.style.left, '20px', '2nd item, 2nd column' );
    equal( elem1.style.top, '0px', '2nd item left' );
    equal( elem2.style.left, '40px', '3rd item, 3rd column' );
    equal( elem2.style.top, '0px', '3rd item top' );
    start();
  });

  stop();
  pckry.layout();
  equal( container.style.height, '80px', 'height set' );
});

})();
