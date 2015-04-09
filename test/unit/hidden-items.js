test( 'hidden items', function() {
  var container = document.querySelector('#hidden-items');
  var pckry = new Packery( container );
  var itemElem1 = pckry.items[1].element;
  var itemElem2 = pckry.items[2].element;
  equal( itemElem1.style.left, '0px', '2nd item on left' );
  equal( itemElem2.style.top, '0px', '3rd item on top' );
});
