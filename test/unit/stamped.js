QUnit.test( 'stamped1', function( assert ) {
  var container = document.querySelector('#stamped1');
  var stamps = container.querySelectorAll('.stamp');
  var pckry = new Packery( container, {
    itemSelector: '.item',
    stamp: stamps
  });

  assert.equal( pckry.stamps.length, 2, '2 stamped elements' );
  var elem0 = pckry.items[0].element;
  assert.equal( elem0.style.left, '0px', '1st item left' );
  assert.equal( elem0.style.top, '0px', '1st item top' );
  var elem1 = pckry.items[1].element;
  assert.equal( elem1.style.left, '52px', '2nd item left' );
  assert.equal( elem1.style.top, '0px', '2nd item top' );
  var elem2 = pckry.items[2].element;
  assert.equal( elem2.style.left, '52px', '3rd item left' );
  assert.equal( elem2.style.top, '20px', '3rd item top' );
  var elem3 = pckry.items[3].element;
  assert.equal( elem3.style.left, '13px', '4th item left' );
  assert.equal( elem3.style.top, '35px', '4th item top' );

  assert.equal( container.style.height, '75px', 'container height' );

  // unstamp first stamp
  pckry.unstamp( stamps[1] );
  assert.equal( pckry.stamps.length, 1, 'element was unstamped' );
  // stamp it back
  pckry.stamp( stamps[1] );
  assert.equal( pckry.stamps.length, 2, 'element was stamped back' );

});

QUnit.test( 'stamped2, items are stamped', function( assert ) {
  var container = document.querySelector('#stamped2');
  var stamps = container.querySelectorAll('.stamp');
  var pckry = new Packery( container, {
    itemSelector: '.item',
    stamp: stamps
  });

  var done = assert.async();
  var layoutItems = pckry._getItemsForLayout( pckry.items );

  assert.equal( layoutItems.length, 7, '7 layout items' );
  var elem0 = layoutItems[0].element;
  assert.equal( elem0.style.left, '28px', '1st item left' );
  assert.equal( elem0.style.top, '0px', '1st item top' );
  var elem3 = layoutItems[3].element;
  assert.equal( elem3.style.left, '0px', '4th item left' );
  assert.equal( elem3.style.top, '28px', '4th item top' );
  var elem4 = layoutItems[4].element;
  assert.equal( elem4.style.left, '20px', '5th item left' );
  assert.equal( elem4.style.top, '40px', '5th item top' );

  // unplacing
  pckry.unstamp( stamps );
  layoutItems = pckry._getItemsForLayout( pckry.items );
  assert.equal( layoutItems.length, 9, '9 layout items' );
  assert.equal( pckry.stamps.length, 0, '0 stamps items' );

  pckry.on( 'layoutComplete', function() {
    var elem0 = pckry.items[0].element;
    assert.equal( elem0.style.left, '0px', '1st item left' );
    assert.equal( elem0.style.top, '0px', '1st item top' );
    var elem4 = pckry.items[4].element;
    assert.equal( elem4.style.left, '0px', '5th item left' );
    assert.equal( elem4.style.top, '20px', '5th item top' );
    done();
  });

  pckry.layout();
});

QUnit.test( 'stamped3, stamp with selector string ', function( assert ) {
  var container3 = document.querySelector('#stamped3');
  var pckry3 = new Packery( container3, {
    itemSelector: '.item',
    stamp: '.stamp'
  });

  assert.equal( pckry3.stamps.length, 2, '2 stamped elements' );

  assert.equal( pckry3.stamps.length, 2, '2 stamped elements' );
  var elem0 = pckry3.items[0].element;
  assert.equal( elem0.style.left, '0px', '1st item left' );
  assert.equal( elem0.style.top, '0px', '1st item top' );
  var elem1 = pckry3.items[1].element;
  assert.equal( elem1.style.left, '52px', '2nd item left' );
  assert.equal( elem1.style.top, '0px', '2nd item top' );
  var elem2 = pckry3.items[2].element;
  assert.equal( elem2.style.left, '52px', '3rd item left' );
  assert.equal( elem2.style.top, '20px', '3rd item top' );
  var elem3 = pckry3.items[3].element;
  assert.equal( elem3.style.left, '13px', '4th item left' );
  assert.equal( elem3.style.top, '35px', '4th item top' );

  assert.equal( container3.style.height, '75px', 'container height' );

  var container4 = document.querySelector('#stamped4');
  var pckry4 = new Packery( container4, {
    itemSelector: '.item',
    stamp: 'foobar'
  });

  assert.ok( pckry4._isLayoutInited, 'bad selector didnt cause error' );
});

QUnit.test( 'stamped with borders', function( assert ) {
  var container = document.querySelector('#stamped-borders');
  var pckry = new Packery( container, {
    itemSelector: '.item',
    stamp: '.stamp'
  });

  var elem0 = pckry.items[0].element;
  var elem1 = pckry.items[1].element;
  var elem2 = pckry.items[2].element;

  assert.equal( elem0.style.left, '50px', '1st item left' );
  assert.equal( elem1.style.left, '50px', '2nd item left' );
  assert.equal( elem2.style.top, '30px', '3rd item top' );

});
