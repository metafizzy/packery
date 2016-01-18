QUnit.test( 'remove', function( assert ) {
  var done = assert.async();
  var container = document.querySelector('#add-remove');
  // packery starts with 4 items
  var pckry = new Packery( container, {
    itemSelector: '.item'
  });
  // remove two items
  var w2Elems = container.querySelectorAll('.w2');
  pckry.on( 'removeComplete', function( removedItems ) {
    assert.equal( true, true, 'removeComplete event did fire' );
    assert.equal( removedItems.length, w2Elems.length, 'remove elems length matches 2nd argument length' );
    for ( var i=0, len = removedItems.length; i < len; i++ ) {
      assert.equal( removedItems[i].element, w2Elems[i], 'removedItems element matches' );
    }
    assert.equal( container.children.length, 2, 'elements removed from DOM' );
    assert.equal( container.querySelectorAll('.w2').length, 0, 'matched elements were removed' );
    done();
  });

  pckry.remove( w2Elems );
  assert.equal( pckry.items.length, 2, 'items removed from Packery instance' );

});
