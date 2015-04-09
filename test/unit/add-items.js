( function() {

'use strict';

var gimmeAnItemElement = window.gimmeAnItemElement;

test( 'addItems', function() {
  var container = document.querySelector('#adding');
  var pckry = new Packery( container, {
    itemSelector: '.item'
  });

  var elem = gimmeAnItemElement();
  var items = pckry.addItems( elem );

  equal( items.length, 1, 'method return array of 1' );
  equal( pckry.items[2].element, elem, 'item was added, element matches' );
  equal( items[0] instanceof Packery.Item, true, 'item is instance of Packery.Item' );
  equal( pckry.items.length, 3, 'item added to items' );

  // try it with an array
  var elems = [ gimmeAnItemElement(), gimmeAnItemElement(), document.createElement('div') ];
  items = pckry.addItems( elems );
  equal( items.length, 2, 'method return array of 2' );
  equal( pckry.items[3].element, elems[0], 'item was added, element matches' );
  equal( pckry.items.length, 5, 'two items added to items' );

  // try it with HTMLCollection / NodeList
  var fragment = document.createDocumentFragment();
  fragment.appendChild( gimmeAnItemElement() );
  fragment.appendChild( document.createElement('div') );
  fragment.appendChild( gimmeAnItemElement() );

  var divs = fragment.querySelectorAll('div');
  items = pckry.addItems( divs );
  equal( items.length, 2, 'method return array of 2' );
  equal( pckry.items[5].element, divs[0], 'item was added, element matches' );
  equal( pckry.items.length, 7, 'two items added to items' );

});

})();
