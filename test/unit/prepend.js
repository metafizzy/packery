QUnit.test( 'prepend', function( assert ) {
  var container = document.querySelector('#prepend');
  var pckry = new Packery( container );
  var itemElemA = pckry.items[0].element;
  var itemElemB = pckry.items[1].element;
  var itemElemC = gimmeAnItemElement();
  itemElemC.style.background = 'orange';
  var itemElemD = gimmeAnItemElement();
  itemElemD.style.background = 'magenta';

  var done = assert.async();
  var ticks = 0;

  pckry.on( 'layoutComplete', function() {
    assert.ok( true, 'layoutComplete triggered' );
    ticks++;
    if ( ticks == 2 ) {
      assert.ok( true, '2 layoutCompletes triggered' );
      done();
    }
  });


  var fragment = document.createDocumentFragment();
  fragment.appendChild( itemElemC );
  fragment.appendChild( itemElemD );
  container.insertBefore( fragment, container.firstChild );
  pckry.prepended([ itemElemC, itemElemD ]);

  assert.equal( pckry.items[0].element, itemElemC, 'item C is first' );
  assert.equal( pckry.items[1].element, itemElemD, 'item D is second' );
  assert.equal( pckry.items[2].element, itemElemA, 'item A is third' );
  assert.equal( pckry.items[3].element, itemElemB, 'item B is fourth' );

});
