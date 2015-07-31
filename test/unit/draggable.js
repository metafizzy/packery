( function() {

function simulateDrag( elem, packery, x, y ) {
  packery.itemDragStart( elem );
  elem.style.left = x + 'px';
  elem.style.top  = y + 'px';
  packery.itemDragMove( elem, x, y );
  packery.itemDragEnd( elem );
}

test( 'draggable', function() {
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

test( 'draggable2, cannot drop over stamped item', function() {
  var container = document.querySelector('#drag2');
  var dragElem = container.querySelector('.dragger');
  var stampElem = container.querySelector('.stamp');


  var pckry = new Packery( container, {
    itemSelector: '.item',
    stamp: '.stamp'
  });
  var dragItem = pckry.getItem(dragElem);
  var originalPositionX = dragItem.position.x;
  var originalPositionY = dragItem.position.y;
  var stampItem = pckry.getItem(stampElem);
  // If I don't call getPosition, then it doesn't work right.
  stampItem.getPosition();

  pckry.on( 'layoutComplete', function() {
    equal( dragItem.position.x, originalPositionX, 'dragged 3rd item x over stamped item, returned to original' +
        ' x' );
    equal( dragItem.position.y, originalPositionY, 'dragged 3rd item y over stamped item, returned to original' +
        ' y' );
    start();
    return true; // bind once
  });
  stop();

  pckry.itemDragStart( dragElem );
  pckry.itemDragMove( dragElem, stampItem.position.x, stampItem.position.y );
  pckry.itemDragEnd( dragElem );
});


})();
