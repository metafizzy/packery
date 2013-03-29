/**
 * Packery tests
 */

( function( window ) {

'use strict';

var $ = window.jQuery;

// -------------------------- helpers -------------------------- //

// trigger next function if then flag has been set
function after( then, nextFn ) {
  if ( then ) {
    nextFn();
  } else {
    setTimeout( nextFn, 20 );
  }
}

// -------------------------- tests -------------------------- //

module('Packery');

test( 'basics', function() {
  equal( typeof Packery === 'function', true, 'Packery is a function' );
  // TODO pckry should be null or something
  var pckry = new Packery();
  // console.log( pckry, typeof pckry );
  ok( !pckry._isInited, 'packery not inited' );

});

window.onload = function onDocReady() {

  test( 'defaults / empty', function() {
    var empty = document.querySelector('#empty');
    var pckry = new Packery( empty );
    deepEqual( pckry.options, Packery.prototype.options, 'default options match prototype' );
    equal( pckry.items.length, 0, 'zero items' );
    equal( pckry.placedElements.length, 0, 'zero placed elements' );
    equal( Packery.data( empty ), pckry, 'data method returns instance' );
    ok( pckry.isResizeBound, 'isResizeBound' );
  });

  test( 'getItems', function() {
    var defaultElem = document.querySelector('#default');
    var defaultPckry = new Packery( defaultElem );

    var filtered = document.querySelector('#filtered');
    var filteredPckry = new Packery( filtered, {
      itemSelector: '.item'
    });

    var found = document.querySelector('#found');
    var foundPckry = new Packery( found, {
      itemSelector: '.item'
    });

    var filterFound = document.querySelector('#filter-found');
    var filterFoundPckry = new Packery( filterFound, {
      itemSelector: '.item'
    });

    equal( defaultPckry.items.length, defaultElem.children.length, 'no itemSelector, all children' );
    equal( filteredPckry.items.length, 6, 'filtered, itemSelector = .item, not all children' );
    equal( foundPckry.items.length, 4, 'found itemSelector = .item, querySelectoring' );
    equal( filterFoundPckry.items.length, 5, 'filter found' );
  });

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
    var items = pckry._getLayoutItems( pckry.items );
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


  test( 'layout extra big', function() {
    var container = document.querySelector('#layout-extra-big');
    var pckry = new Packery( container );

    var elem1 = pckry.items[1].element;
    var elem2 = pckry.items[2].element;
    var elem3 = pckry.items[3].element;
    var elem4 = pckry.items[4].element;

    equal( elem1.style.top, '20px', '2nd item top' );
    equal( elem2.style.top, '40px', '3rd item top' );
    equal( elem3.style.top, '20px', '4th item top' );
    equal( elem4.style.top, '60px', '5th item top' );
  });

  // ----- consecutive ----- //

  test( 'consecutive', function() {
    var container = document.querySelector('#consecutive');
    var pckry = new Packery( container );

    var i0 = container.querySelector('.i0');
    var i1 = container.querySelector('.i1');
    var i3 = container.querySelector('.i3');
    i1.style.width = '28px';
    i1.style.height = '28px';
    i1.style.background = 'blue';

    pckry.on( 'layoutComplete', function() {
      ok( true, 'layoutComplete triggered' );
      equal( i3.style.left, '0px', 'i3.style.left' );
      equal( i3.style.top, '20px', 'i3.style.top' );
      after( then, fit1 );
      return true;
    });

    stop();
    pckry.layout();
    var then = true;

    function fit1() {
      pckry.on( 'layoutComplete', function() {
        equal( i3.style.left, '60px', 'i3.style.left' );
        equal( i3.style.top, '30px', 'i3.style.top' );
        // all done
        start();
        return true;
      });
      i0.style.width = '38px';
      i0.style.height = '38px';
      i0.style.background = 'orange';
      pckry.layout();
      return true;
    }

  });

  // -----  ----- //

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
    var colW = pckry.columnWidth + pckry.gutter;
    var rowH = pckry.rowHeight + pckry.gutter;
    for ( var i=0, len = pckry.items.length; i < len; i++ ) {
      var elem = pckry.items[i].element;
      var x = parseInt( elem.style.left, 10 );
      var y = parseInt( elem.style.top, 10 );
      equal( x % colW, 0, 'item ' + i + ' x position is multiple of columnWidth' );
      equal( y % rowH, 0, 'item ' + i + ' y position is multiple of rowHeight' );
    }
  }

  test( 'layout with columnWidth and rowHeight', function() {
    var container = document.querySelector('#gridded1');
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
      after( then1, setGutter );
      return true; // bind once
    });
    stop();
    pckry.layout();
    var then1 = true;
    equal( pckry.columnWidth, 30, 'columnWidth is set from element width, in px' );
    equal( pckry.rowHeight, 25, 'rowHeight is set from element height, in px' );

    function setGutter() {
      pckry.options.gutter = container.querySelector('.gutter-sizer');
      pckry.on( 'layoutComplete', function() {
        checkPackeryGrid( pckry );
        after( then2, setPercentageGrid );
        return true; // bind once
      });
      pckry.layout();
      var then2 = true;
      equal( pckry.gutter, 10, 'gutter set from element width, in px' );
    }

    function setPercentageGrid() {
      gridSizer.style.width = '40%';
      pckry.on( 'layoutComplete', function() {
        checkPackeryGrid( pckry );
        start();
        return true; // bind once
      });
      pckry.layout();
      equal( pckry.columnWidth, 32, 'columnWidth is set from element width, in percentage' );
    }

  });

  test( 'columnWidth, rowHeight, gutter via selector', function() {
    var container = document.querySelector('#gridded2');
    appendRandomSizedItems( container );

    var pckry = new Packery( container, {
      itemSelector: '.item',
      columnWidth: '.grid-sizer',
      rowHeight: '.grid-sizer',
      gutter: '.gutter-sizer'
    });

    equal( pckry.columnWidth, 30, 'columnWidth' );
    equal( pckry.rowHeight, 25, 'rowHeight' );
    equal( pckry.gutter, 10, 'gutter' );
  });

  // ----- border box ----- //

  test( 'container size', function() {
    var container = document.querySelector('#container-size');
    var pckry = new Packery( container );
    equal( container.style.height, '40px', 'default height' );

    pckry.options.gutter = 4;
    pckry._getMeasurements();
    pckry.layout();
    equal( container.style.height, '40px', 'added gutter, height same' );

    // addPaddingBorders() {
    container.style.padding = '1px 2px 3px 4px';
    container.style.borderStyle = 'solid';
    container.style.borderWidth = '1px 2px 3px 4px';
    pckry.layout();
    equal( container.style.height, '40px', 'add padding, height same' );

    // border box
    container.style.WebkitBoxSizing = 'border-box';
    container.style.MozBoxSizing = 'border-box';
    container.style.boxSizing = 'border-box';
    pckry.layout();
    equal( container.style.height, '48px', 'border-box, height + padding + border' );
  });

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

    // unplace first stamp
    pckry.unplace( stamps[1] );
    equal( pckry.placedElements.length, 1, 'element was unplaced' );
    // place it back
    pckry.place( stamps[1] );
    equal( pckry.placedElements.length, 2, 'element was placed back' );

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

    stop();
    pckry.layout();
  });

  test( 'placed3, place with selector string ', function() {
    var container3 = document.querySelector('#placed3');
    var pckry3 = new Packery( container3, {
      itemSelector: '.item',
      placedElements: '.stamp'
    });

    equal( pckry3.placedElements.length, 2, '2 placed elements' );

    equal( pckry3.placedElements.length, 2, '2 placed elements' );
    var elem0 = pckry3.items[0].element;
    equal( elem0.style.left, '0px', '1st item left' );
    equal( elem0.style.top, '0px', '1st item top' );
    var elem1 = pckry3.items[1].element;
    equal( elem1.style.left, '52px', '2nd item left' );
    equal( elem1.style.top, '0px', '2nd item top' );
    var elem2 = pckry3.items[2].element;
    equal( elem2.style.left, '52px', '3rd item left' );
    equal( elem2.style.top, '20px', '3rd item top' );
    var elem3 = pckry3.items[3].element;
    equal( elem3.style.left, '13px', '4th item left' );
    equal( elem3.style.top, '35px', '4th item top' );

    equal( container3.style.height, '75px', 'container height' );

    var container4 = document.querySelector('#placed4');
    var pckry4 = new Packery( container4, {
      itemSelector: '.item',
      placedElements: 'foobar'
    });

    ok( pckry4._isInited, 'bad selector didnt cause error' );
  });

  test( 'placed with borders', function() {
    var container = document.querySelector('#placed-borders');
    var pckry = new Packery( container, {
      itemSelector: '.item',
      placedElements: '.stamp'
    });

    var elem0 = pckry.items[0].element;
    var elem1 = pckry.items[1].element;
    var elem2 = pckry.items[2].element;

    equal( elem0.style.left, '50px', '1st item left' );
    equal( elem1.style.left, '50px', '2nd item left' );
    equal( elem2.style.top, '30px', '3rd item top' );

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
    packery.itemDragEnd( elem );
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
      // trigger the next thing
      after( then1, dragOutside );
      return true; // bind once
    });
    stop();
    simulateDrag( dragElem, pckry, 35, 15 );
    var then1 = true;

    function dragOutside() {
      pckry.on( 'dragItemPositioned', function() {
        equal( true, true, 'dragItemPositioned event did trigger' );
        equal( dragElem.style.left, '60px', 'dragged 3rd item x, aligned inside container' );
        equal( dragElem.style.top, '0px', 'dragged 3rd item y, aligned inside container' );
        equal( pckry.items[3].element, dragElem, 'dragged elem in now 4th in items' );
        // the next thing
        after( then2, dragWithGrid );
        return true; // bind once
      });

      simulateDrag( dragElem, pckry, 300, -30 );
      var then2 = true;
    }

    function dragWithGrid() {
      pckry.options.columnWidth = 25;
      pckry.options.rowHeight = 25;
      pckry._getMeasurements();
      pckry.on( 'dragItemPositioned', function() {
        equal( dragElem.style.left, '25px', 'dragged 3rd item x, aligned to grid' );
        // TODO, this should be 50px
        equal( dragElem.style.top, '50px', 'dragged 3rd item y, aligned to grid' );
        // the next thing
        after( then3, dragOutsideWithGrid );
        return true; // bind one
      });
      simulateDrag( dragElem, pckry, 35, 160 );
      var then3 = true;
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

  // ----- fitting ----- //

  test( '.fit()', function() {
    var container = document.querySelector('#fitting');
    var pckry = new Packery( container );

    var elem1 = container.querySelector('.i1');
    var elem2 = container.querySelector('.i2');
    var elem3 = container.querySelector('.i3');
    var item3 = pckry.getItemFromElement( elem3 );
    // expand item3
    elem3.style.width = '48px';
    elem3.style.height = '28px';
    elem3.style.background = 'blue';

    // quickie async
    var isFit = false;
    var isLaidOut = false;
    function ready1() {
      if ( !isFit || !isLaidOut ) {
        return;
      }
      equal( elem1.style.left, '0px', 'elem1.style.left = 0' );
      equal( elem1.style.top, '20px', 'elem1.style.top = 20px' );
      equal( elem2.style.left, '20px', 'elem2.style.left = 20px' );
      equal( elem2.style.top, '30px', 'elem2.style.top = 30px' );
      isFit = false;
      isLaidOut = false;
      // trigger next thing
      after( then1, fit2 );
    }

    pckry.on( 'fitComplete', function( pckryInstance, item ) {
      ok( true, 'fitComplete event emitted' );
      equal( pckryInstance, pckry, 'packery instance returned' );
      equal( item, item3, 'item argument returned' );
      equal( elem3.style.left, '30px', 'elem3.style.left = 30px' );
      isFit = true;
      ready1();
      return true;
    });

    pckry.on( 'layoutComplete', function() {
      ok( true, 'layoutComplete event emitted' );
      isLaidOut = true;
      ready1();
      return true;
    });

    // fit it
    stop();
    pckry.fit( elem3 );
    var then1 = true;

    function ready2() {
      if ( !isFit || !isLaidOut ) {
        return;
      }
      isFit = false;
      isLaidOut = false;
      // trigger next thing
      after( then2, fit3 );
    }

    var then2;
    function fit2() {
      elem3.style.width = '18px';
      elem3.style.height = '18px';

      pckry.on( 'fitComplete', function() {
        ok( true, 'fitComplete event emitted' );
        equal( elem3.style.left, '40px', 'elem3.style.left = 40px' );
        equal( elem3.style.top, '20px', 'elem3.style.top = 20px' );
        isFit = true;
        ready2();
        return true;
      });

      pckry.on( 'layoutComplete', function() {
        ok( true, 'layoutComplete event emitted' );
        isLaidOut = true;
        ready2();
        return true;
      });

      pckry.fit( elem3, 40, 20 );
      then2 = true;
    }

    function ready3() {
      if ( !isFit || !isLaidOut ) {
        return;
      }
      isFit = false;
      isLaidOut = false;
      // trigger next thing
      after( then3, fit4 );
      // fit4();
    }

    var then3;
    function fit3() {
      pckry.on( 'fitComplete', function() {

        equal( elem3.style.left, '60px', 'x value limited' );
        equal( elem3.style.top, '120px', 'y value NOT limited' );
        isFit = true;
        ready3();
        return true;
      });
      pckry.on( 'layoutComplete', function() {
        isLaidOut = true;
        ready3();
        return true;
      });
      // try to position item outside container
      pckry.fit( elem3, 120, 120 );
      then3 = true;
    }

    // fit with columnWidth and rowHeight
    function fit4() {
      pckry.options.columnWidth = 30;
      pckry.options.rowHeight = 30;

      pckry.on( 'fitComplete', function() {
        ok( true, 'fitComplete event emitted' );
        equal( elem3.style.left, '30px', 'with columnWidth, elem3.style.left = 30px' );
        equal( elem3.style.top, '120px', 'with rowHeight, elem3.style.top = 120px' );
        start();
      });

      pckry.fit( elem3 );
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

    equal( $.data( container3, 'packery' ), pckry3, '$.data( elem, "packery") returns Packery instance' );

  });

  // ----- jQuery ----- //


  test( 'jQuery Packery', function() {
    var $elem = $('#jquery');
    ok( $.fn.packery, '.packery is in jQuery.fn namespace' );
    equal( typeof $elem.packery, 'function', '.packery is a plugin' );
    $elem.packery();
    var pckry = $elem.data('packery');
    ok( pckry, 'packery instance via .data()' );
    equal( pckry, Packery.data( $elem[0] ), 'instance matches the same one via Packery.data()' );

    var item4 = $elem.children()[4];
    equal( item4.style.left, '0px', '5th item left' );
    equal( item4.style.top, '40px', '5th item top' );

    $elem.children().first().css({
      width: 48,
      height: 8,
      background: 'blue'
    });

    $elem.packery( 'on', 'layoutComplete', function() {
      ok( true, 'layoutComplete event emitted' );
      equal( item4.style.left, '20px', '4th item left after layout' );
      equal( item4.style.top, '30px', '4th item top after layout' );
      start();
    });

    $elem.packery();
    stop();
  });

};


})( window );
