( function() {

'use strict';

test( 'getItems', function() {
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

  equal( defaultPckry.items.length, defaultElem.children.length, 'no itemSelector, all children' );
  equal( filteredPckry.items.length, 6, 'filtered, itemSelector = .item, not all children' );
  equal( foundPckry.items.length, 4, 'found itemSelector = .item, querySelectoring' );
  equal( filterFoundPckry.items.length, 5, 'filter found' );
});

})();
