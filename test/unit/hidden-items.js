QUnit.test( 'hidden items', function( assert ) {
  var container = document.querySelector('#hidden-items');
  var pckry = new Packery( container );
  var itemElem1 = pckry.items[1].element;
  var itemElem2 = pckry.items[2].element;
  assert.equal( itemElem1.style.left, '0px', '2nd item on left' );
  assert.equal( itemElem2.style.top, '0px', '3rd item on top' );
});
