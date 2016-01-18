QUnit.test( 'draggable', function( assert ) {
  var container = document.querySelector('#draggable');
  var itemElems = container.querySelectorAll('.item');
  var dragElem = container.querySelector('.dragger');

  var pckry = new Packery( container, {
    transitionDuration: '0.2s'
  });

  var done = assert.async();

  function simulateDrag( x, y ) {
    pckry.itemDragStart( dragElem );
    pckry.itemDragMove( dragElem, x, y );
    pckry.itemDragEnd( dragElem );
  }

  function checkItemPosition( itemElem, x, y, message ) {
    var actual = itemElem.style.left + ' ' + itemElem.style.top;
    var expected = x + 'px ' + y + 'px';
    message = message || 'item position';
    assert.equal( actual, expected, message );
  }

  // simulate drag to middle
  pckry.once( 'dragItemPositioned', function() {
    assert.ok( true, 'dragItemPositioned did trigger, 4th item moved to 35, 15' );
    checkItemPosition( itemElems[0], 0, 0, '1st item' );
    checkItemPosition( itemElems[1], 20, 0, '2nd item' );
    checkItemPosition( itemElems[2], 40, 0, '3rd item' );
    checkItemPosition( itemElems[6], 40, 40, '7th item, moved down below dragged item' );
    checkItemPosition( itemElems[7], 60, 0, '8th item, moved up' );
    checkItemPosition( dragElem, 40, 20, 'drag item, 2nd row, 3rd column' );
    assert.equal( pckry.items[6].element, dragElem, 'dragged elem in now 7th in items' );
    // HACK setTimeout because of Packery bug
    setTimeout( dragOutside );
  });

  simulateDrag( 35, 15 );

  function dragOutside() {
    pckry.once( 'dragItemPositioned', function() {
      assert.ok( true, 'dragItemPositioned event did trigger' );
      checkItemPosition( dragElem, 60, 0, 'drag item, 1st row, 4th column' );
      checkItemPosition( itemElems[4], 0, 20, '5th item, did not move' );
      checkItemPosition( itemElems[6], 40, 20, '7th item, moved back up' );
      checkItemPosition( itemElems[7], 60, 20, '8th item, moved back down' );
      assert.equal( pckry.items[3].element, dragElem, 'dragged elem in now 4th in items' );

      setTimeout( dragWithGrid );
    });

    simulateDrag( 300, -60 );
  }

  function dragWithGrid() {
    pckry.options.columnWidth = 25;
    pckry.options.rowHeight = 25;
    // disable transition, layout, re-enable transition
    pckry.options.transitionDuration = 0;
    pckry.layout();
    pckry.options.transitionDuration = '0.2s';

    pckry.once( 'dragItemPositioned', function() {
      checkItemPosition( dragElem, 25, 25, 'drag item, 2nd row, 2nd column' );
      checkItemPosition( itemElems[4], 25, 50, '5th item, 3rd row, 2nd column, moved down' );
      checkItemPosition( itemElems[5], 50, 25, '6th item, 2nd row, 3rd column, did not move' );
      checkItemPosition( itemElems[6], 0, 25, '7th item, 2nd row, 1st column, moved up' );
      checkItemPosition( itemElems[7], 25, 75, '7th item, 4th row, 2nd column, moved down' );

      setTimeout( dragOutsideWithGrid );
    });
    simulateDrag( 35, 35 );
  }

  function dragOutsideWithGrid() {
    pckry.once( 'dragItemPositioned', function() {
      checkItemPosition( dragElem, 50, 0, 'dragged, top right corner in grid' );
      done();
    });
    simulateDrag( 300, -30 );
  }

});
