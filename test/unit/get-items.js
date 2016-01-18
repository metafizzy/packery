QUnit.test( 'getItems', function( assert ) {
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

  assert.equal( defaultPckry.items.length, defaultElem.children.length, 'no itemSelector, all children' );
  assert.equal( filteredPckry.items.length, 6, 'filtered, itemSelector = .item, not all children' );
  assert.equal( foundPckry.items.length, 4, 'found itemSelector = .item, querySelectoring' );
  assert.equal( filterFoundPckry.items.length, 5, 'filter found' );
});
