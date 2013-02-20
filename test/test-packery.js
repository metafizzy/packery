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
    var empty = document.querySelector('#empty');
    var pckry = new Packery( empty );
    deepEqual( pckry.options, Packery.prototype.options, 'default options match prototype' );
    equal( pckry.items.length, 0, 'zero items' );
    equal( pckry.placedElements.length, 0, 'zero placed elements' );
    equal( Packery.data( empty ), pckry, 'data method returns instance' );
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
    var item;
    for ( var i=0; i < 9; i++ ) {
      item = document.createElement('div');
      item.className = 'item';
      var w = Math.floor( Math.random() * Math.random() * 70 ) + 10;
      var h = Math.floor( Math.random() * Math.random() * 70 ) + 10;
      item.style.width  = w + 'px';
      item.style.height = h + 'px';
      frag.appendChild( item );
    }

    // last one isn't random, but is needed for checking
    // bigger than colum width and stuff
    item = document.createElement('div');
    item.className = 'item';
    item.style.width  = '72px';
    item.style.height = '25px';
    frag.appendChild( item );

    container.appendChild( frag );
  }

  function checkPackeryGrid( pckry ) {
    for ( var i=0, len = pckry.items.length; i < len; i++ ) {
      var elem = pckry.items[i].element;
      var x = parseInt( elem.style.left, 10 );
      var y = parseInt( elem.style.top, 10 );
      equal( x % pckry.columnWidth, 0, 'item ' + i + ' x position is multiple of columnWidth' );
      equal( y % pckry.rowHeight, 0, 'item ' + i + ' y position is multiple of rowHeight' );
    }
  }

  test( 'layout with columnWidth and rowHeight', function() {
    var container = document.querySelector('#gridded');
    appendRandomSizedItems( container );

    var pckry = new Packery( container, {
      itemSelector: '.item',
      columnWidth: 25,
      rowHeight: 30
    });

    equal( pckry.options.columnWidth, 25, 'columnWidth option is set' );
    equal( pckry.options.rowHeight, 30, 'rowHeight option is set' );
    equal( pckry.columnWidth, 25, 'columnWidth is set' );
    equal( pckry.rowHeight, 30, 'rowHeight is set' );
    checkPackeryGrid( pckry );

    var gridSizer = container.querySelector('.grid-sizer');

    pckry.options.columnWidth = gridSizer;
    pckry.options.rowHeight = gridSizer;
    pckry.on( 'layoutComplete', function() {
      checkPackeryGrid( pckry );
      setTimeout( setPercentageGrid, 20 );
      return true; // bind one
    });
    pckry.layout();
    equal( pckry.columnWidth, 30, 'columnWidth is set from element width, in px' );
    equal( pckry.rowHeight, 25, 'rowHeight is set from element height, in px' );
    stop();

    function setPercentageGrid() {
      gridSizer.style.width = '40%';
      pckry.on( 'layoutComplete', function() {
        checkPackeryGrid( pckry );
        start();
        return true; // bind one
      });
      pckry.layout();
      equal( pckry.columnWidth, 32, 'columnWidth is set from element width, in percentage' );
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

  // ----- drag ----- //

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
      pckry.options.columnWidth = 25;
      pckry.options.rowHeight = 25;
      pckry._getMeasurements();
      pckry.on( 'dragItemPositioned', function() {
        equal( dragElem.style.left, '25px', 'dragged 3rd item x, aligned to grid' );
        equal( dragElem.style.top, '25px', 'dragged 3rd item y, aligned to grid' );
        start();
        setTimeout( dragOutsideWithGrid, 20 );
        stop();
        return true; // bind one
      });
      simulateDrag( dragElem, pckry, 35, 160 );
    }

    function dragOutsideWithGrid() {
      pckry.on( 'dragItemPositioned', function() {
        equal( dragElem.style.left, '50px', 'dragged 3rd item x, aligned inside container, with grid' );
        equal( dragElem.style.top, '0px', 'dragged 3rd item y, aligned inside container' );
        start();
        return true; // bind once
      });
      simulateDrag( dragElem, pckry, 300, -30 );
    }

  });

  // ----- declarative ----- //

  test( 'declarative', function() {
    // no data-packery-options
    var container1 = document.querySelector('#declarative');
    var pckry1 = Packery.data( container1 );
    ok( pckry1 instanceof Packery, 'Packery instance retrieved from element' );
    deepEqual( pckry1.options, Packery.prototype.options, 'options match defaults' );
    ok( pckry1._isInited, 'Packer was initialized' );

    // has data-packery-options, but bad JSON
    var container2 = document.querySelector('#declarative-bad-json');
    var pckry2 = Packery.data( container2 );
    ok( !pckry2, 'bad JSON in data-packery-options does not init Packery' );
    ok( !container2.packeryGUID, 'no expando property on element' );

    // has good data-packery-options
    var container3 = document.querySelector('#declarative-good-json');
    var pckry3 = Packery.data( container3 );
    ok( pckry3 instanceof Packery, 'Packery instance retrieved from element, with good JSON in data-packery-options' );
    strictEqual( pckry3.options.columnWidth, 25, 'columnWidth option was set' );
    strictEqual( pckry3.options.rowHeight, 30, 'rowHeight option was set' );
    strictEqual( pckry3.options.transitionDuration, '1.2s', 'transitionDuration option was set' );
    strictEqual( pckry3.options.isResizable, false, 'isResizable option was set' );
  });

};


})( window );
