/**
 * Packery tests
 */

( function( window ) {

'use strict';

module('Packery');

test( 'basics', function() {
  equal( typeof Packery === 'function', true, 'Packery is a function' );

  // var pckry = new Packery();
  // console.log( pckry, typeof pckry );
  // strictEqual( pckry, undefined, 'packery with no element returns undefined' );

});

window.onload = function onDocReady() {

  test( 'defaults / empty', function() {
    var pckry = new Packery( document.querySelector('#empty') );
    deepEqual( pckry.options, Packery.prototype.options, 'default options match prototype' );
    equal( pckry.items.length, 0, 'zero items' );
    equal( pckry.placedElements.length, 0, 'zero placed elements' );
  });

  var ex1 = document.getElementById('ex1');
  var pack1 = new Packery( ex1, {
    itemSelector: '.item'
  });

  var ex2 = document.getElementById('ex2');
  var pack2 = new Packery( ex2, {
    itemSelector: '.item'
  });


  test( 'getItems', function() {
    equal( pack1.items.length, 6, 'filtered, itemSelector = .item, not all children' );
    equal( pack2.items.length, 4, 'found itemSelector = .item, querySelectoring' );
  });

  test( 'layout', function() {
    var elem0 = pack1.items[0].element;
    var elem1 = pack1.items[1].element;
    var elem2 = pack1.items[2].element;
    equal( elem0.style.left, '0px', 'first item left' );
    equal( elem0.style.top, '0px', 'first item left' );
    equal( elem1.style.left, '40px', '2nd item, 2nd column' );
    equal( elem1.style.top, '0px', '2nd item top' );
    equal( elem2.style.left, '0px', '3rd item, left' );
    equal( elem2.style.top, '20px', '3rd item, 2nd row' );
    equal( ex1.style.height, '60px', 'height set' );

    // change size of elems to change layout
    elem0.style.width = '18px';
    pack1.items[3].element.style.height = '58px';
    pack1.on( 'layoutComplete', function( obj ) {
      equal( true, true, 'layoutComplete event did fire' );
      equal( obj, pack1, 'event-emitted argument matches Packery instance' );
      equal( elem1.style.left, '20px', '2nd item, 2nd column' );
      equal( elem1.style.top, '0px', '2nd item left' );
      equal( elem2.style.left, '40px', '3rd item, 3rd column' );
      equal( elem2.style.top, '0px', '3rd item top' );
      equal( ex1.style.height, '80px', 'height set' );
      start();
    });

    stop();
    pack1.layout();

  });

  function appendRandomSizedItems( container ) {
    var frag = document.createDocumentFragment();
    for ( var i=0; i < 10; i++ ) {
      var item = document.createElement('div');
      item.className = 'item';
      var w = Math.floor( Math.random() * Math.random() * 70 ) + 10;
      var h = Math.floor( Math.random() * Math.random() * 70 ) + 10;
      item.style.width  = w + 'px';
      item.style.height = h + 'px';
      frag.appendChild( item );
    }

    container.appendChild( frag );
  }

  var gridded = document.querySelector('#gridded');
  appendRandomSizedItems( gridded );

  test( 'layout with columnWidth and rowHeight', function() {
    var pckry = new Packery( gridded, {
      columnWidth: 20,
      rowHeight: 20
    });

    equal( pckry.options.columnWidth, 20, 'columnWidth option is set' );
    equal( pckry.options.rowHeight, 20, 'rowHeight option is set' );

    for ( var i=0, len = pckry.items.length; i < len; i++ ) {
      var elem = pckry.items[i].element;
      var x = parseInt( elem.style.left, 10 );
      var y = parseInt( elem.style.top, 10 );
      equal( x % pckry.options.columnWidth, 0, 'item ' + i + ' x position is multiple of columnWidth' );
      equal( y % pckry.options.rowHeight, 0, 'item ' + i + ' y position is multiple of rowHeight' );
    }

  });


  test( 'remove', function() {
    var container = document.querySelector('#add-remove');
    // packery starts with 4 items
    var pckry = new Packery( container, {
      itemSelector: '.item'
    });
    // remove two items
    pckry.on( 'removeComplete', function( obj ) {
      equal( true, true, 'removeComplete event did fire' );
      equal( obj, pckry, 'event-emitted argument matches Packery instance' );
      equal( container.children.length, 2, 'elements removed from DOM' );
      equal( container.querySelectorAll('.w2').length, 0, 'matched elements were removed' );
      start();
    });
    pckry.remove( container.querySelectorAll('.w2') );
    equal( pckry.items.length, 2, 'items removed from Packery instance' );

    stop();
  });

  test( 'placed1', function() {
    var container = document.querySelector('#placed1');
    var stamps = container.querySelectorAll('.stamp');
    var pckry = new Packery( container, {
      itemSelector: '.item',
      placedElements: stamps
    });

    equal( pckry.placedElements.length, 2, '2 placed elements' );
    var elem0 = pckry.items[0].element;
    equal( elem0.style.left, '0px', '1st item left' );
    equal( elem0.style.top, '0px', '1st item top' );
    var elem1 = pckry.items[1].element;
    equal( elem1.style.left, '52px', '2nd item left' );
    equal( elem1.style.top, '0px', '2nd item top' );
    var elem2 = pckry.items[2].element;
    equal( elem2.style.left, '52px', '3rd item left' );
    equal( elem2.style.top, '20px', '3rd item top' );
    var elem3 = pckry.items[3].element;
    equal( elem3.style.left, '13px', '4th item left' );
    equal( elem3.style.top, '35px', '4th item top' );

    equal( container.style.height, '75px', 'container height' );
  });

  test( 'placed2, items are placed', function() {
    var container = document.querySelector('#placed2');
    var stamps = container.querySelectorAll('.stamp');
    var pckry = new Packery( container, {
      itemSelector: '.item',
      placedElements: stamps
    });

    var layoutItems = pckry._getLayoutItems( pckry.items );

    equal( layoutItems.length, 7, '7 layout items' );
    var elem0 = layoutItems[0].element;
    equal( elem0.style.left, '29px', '1st item left' );
    equal( elem0.style.top, '0px', '1st item top' );
    var elem3 = layoutItems[3].element;
    equal( elem3.style.left, '0px', '4th item left' );
    equal( elem3.style.top, '29px', '4th item top' );
    var elem4 = layoutItems[4].element;
    equal( elem4.style.left, '20px', '5th item left' );
    equal( elem4.style.top, '40px', '5th item top' );

    // unplacing
    pckry.unplace( stamps );
    layoutItems = pckry._getLayoutItems( pckry.items );
    equal( layoutItems.length, 9, '9 layout items' );
    equal( pckry.placedElements.length, 0, '0 placedElements items' );

    pckry.on( 'layoutComplete', function() {
      var elem0 = pckry.items[0].element;
      equal( elem0.style.left, '0px', '1st item left' );
      equal( elem0.style.top, '0px', '1st item top' );
      var elem4 = pckry.items[4].element;
      equal( elem4.style.left, '0px', '5th item left' );
      equal( elem4.style.top, '20px', '5th item top' );
      start();
    });

    pckry.layout();
    stop();

  });

  function gimmeAnItemElement() {
    var elem = document.createElement('div');
    elem.className = 'item';
    return elem;
  }

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

  function simulateDrag( elem, packery, x, y ) {
    packery.itemDragStart( elem );
    elem.style.left = x + 'px';
    elem.style.top  = y + 'px';
    packery.itemDragMove( elem, x, y );
    packery.itemDragStop( elem );
  }

  test( 'draggabilly 1', function() {
    var container = document.querySelector('#drag1');
    var pckry = new Packery( container );
    var dragElem = container.querySelector('.dragger');

    // simulate drag to middle
    pckry.on( 'layoutComplete', function() {
      equal( true, true, 'layout complete did trigger' );
      var itemElems = container.querySelectorAll('.item');
      equal( itemElems[1].style.left, '55px', '2nd item x' );
      equal( itemElems[1].style.top, '0px', '2nd item y' );
      equal( itemElems[2].style.left, '0px', '3rd item x' );
      equal( itemElems[2].style.top, '20px', '3rd item y' );
      equal( dragElem.style.left, '35px', 'dragged 3rd item x' );
      equal( dragElem.style.top, '15px', 'dragged 3rd item y' );
      equal( pckry.items[2].element, dragElem, 'dragged elem in now 3rd in items' );
      start();
      // trigger the next thing
      dragOutside();
      return true; // bind once
    });
    simulateDrag( dragElem, pckry, 35, 15 );
    stop();

    function dragOutside() {
      pckry.on( 'dragItemPositioned', function() {
        equal( true, true, 'dragItemPositioned event did trigger' );
        equal( dragElem.style.left, '60px', 'dragged 3rd item x, aligned inside container' );
        equal( dragElem.style.top, '0px', 'dragged 3rd item y, aligned inside container' );
        equal( pckry.items[3].element, dragElem, 'dragged elem in now 4th in items' );
        start();
        setTimeout( dragWithGrid, 20 );
        stop();
        return true; // bind once
      });
      simulateDrag( dragElem, pckry, 300, -30 );
      stop();
    }

    function dragWithGrid() {
      pckry.options.columnWidth = 20;
      pckry.options.rowHeight = 20;
      pckry.on( 'dragItemPositioned', function() {
        equal( dragElem.style.left, '40px', 'dragged 3rd item x, aligned to grid' );
        equal( dragElem.style.top, '20px', 'dragged 3rd item y, aligned to grid' );
        start();
      });
      simulateDrag( dragElem, pckry, 35, 15 );
    }

  });

};


})( window );
