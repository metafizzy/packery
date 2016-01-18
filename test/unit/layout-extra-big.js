QUnit.test( 'layout extra big', function( assert ) {
  var container = document.querySelector('#layout-extra-big');
  var pckry = new Packery( container );

  var elem1 = pckry.items[1].element;
  var elem2 = pckry.items[2].element;
  var elem3 = pckry.items[3].element;
  var elem4 = pckry.items[4].element;

  assert.equal( elem1.style.top, '20px', '2nd item top' );
  assert.equal( elem2.style.top, '40px', '3rd item top' );
  assert.equal( elem3.style.top, '20px', '4th item top' );
  assert.equal( elem4.style.top, '60px', '5th item top' );
});
