QUnit.test( 'layout', function( assert ) {

  var done = assert.async();

  function checkItemPosition( elem, left, top, message ) {
    message = message || '';
    var actual = elem.style.left + ' ' + elem.style.top;
    var expected = left + 'px ' + top + 'px';
    assert.equal( actual, expected, expected + ' ' + message );
  }

  var container = document.querySelector('#layout');
  var pckry = new Packery( container );
  var elem0 = pckry.items[0].element;
  var elem1 = pckry.items[1].element;
  var elem2 = pckry.items[2].element;
  var elem3 = pckry.items[3].element;

  checkItemPosition( elem0, 0, 0, 'first item' );
  checkItemPosition( elem1, 40, 0, '2nd item' );
  checkItemPosition( elem2, 0, 20, '3rd item' );
  assert.equal( container.style.height, '60px', 'height set' );

  // change size of elems to change layout
  elem0.style.width = '18px';
  elem3.style.height = '58px';
  var items = pckry._getItemsForLayout( pckry.items );
  pckry.once( 'layoutComplete', function( completeItems ) {
    assert.equal( true, true, 'layoutComplete event did fire' );
    assert.equal( completeItems.length, items.length, 'event-emitted items matches layout items length' );
    assert.strictEqual( completeItems[0], items[0], 'event-emitted items has same first item' );
    var len = completeItems.length - 1;
    assert.strictEqual( completeItems[ len ], items[ len ], 'event-emitted items has same last item' );
    checkItemPosition( elem1, 20, 0, '2nd item' );
    checkItemPosition( elem2, 40, 0, '3nd item' );

    setTimeout( checkHorizontal );
  });

  pckry.layout();
  assert.equal( container.style.height, '80px', 'height set' );

  function checkHorizontal() {
    // disable transition
    pckry.options.transitionDuration = 0;
    pckry.options.horizontal = true;
    pckry.layout();
    checkItemPosition( elem0, 0, 0, 'horizontal, first item' );
    checkItemPosition( elem1, 0, 20, 'horizontal, 2nd item' );
    checkItemPosition( elem2, 0, 60, 'horizontal, 2nd item' );
    assert.equal( container.style.width, '60px', 'width set' );

    done();
  }
});
