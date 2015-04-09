( function() {

'use strict';

var appendRandomSizedItems = window.appendRandomSizedItems;
var after = window.after;

function checkPackeryGrid( pckry ) {
  var colW = pckry.columnWidth + pckry.gutter;
  var rowH = pckry.rowHeight + pckry.gutter;
  for ( var i=0, len = pckry.items.length; i < len; i++ ) {
    var elem = pckry.items[i].element;
    var x = parseInt( elem.style.left, 10 );
    var y = parseInt( elem.style.top, 10 );
    equal( x % colW, 0, 'item ' + i + ' x position is multiple of columnWidth' );
    equal( y % rowH, 0, 'item ' + i + ' y position is multiple of rowHeight' );
  }
}

test( 'layout with columnWidth and rowHeight', function() {
  var container = document.querySelector('#gridded1');
  appendRandomSizedItems( container );

  var pckry = new Packery( container, {
    itemSelector: '.item',
    columnWidth: 25,
    rowHeight: 30
  });

  equal( pckry.options.columnWidth, 25, 'columnWidth option is set' );
  equal( pckry.options.rowHeight, 30, 'rowHeight option is set' );
  equal( pckry.columnWidth, 25, 'columnWidth is set' );
  equal( pckry.rowHeight, 30, 'rowHeight is set' );
  checkPackeryGrid( pckry );

  var gridSizer = container.querySelector('.grid-sizer');

  pckry.options.columnWidth = gridSizer;
  pckry.options.rowHeight = gridSizer;
  pckry.on( 'layoutComplete', function() {
    checkPackeryGrid( pckry );
    after( then1, setGutter );
    return true; // bind once
  });
  stop();
  pckry.layout();
  var then1 = true;
  equal( pckry.columnWidth, 30, 'columnWidth is set from element width, in px' );
  equal( pckry.rowHeight, 25, 'rowHeight is set from element height, in px' );

  function setGutter() {
    pckry.options.gutter = container.querySelector('.gutter-sizer');
    pckry.on( 'layoutComplete', function() {
      checkPackeryGrid( pckry );
      after( then2, setPercentageGrid );
      return true; // bind once
    });
    pckry.layout();
    var then2 = true;
    equal( pckry.gutter, 10, 'gutter set from element width, in px' );
  }

  function setPercentageGrid() {
    gridSizer.style.width = '40%';
    pckry.on( 'layoutComplete', function() {
      checkPackeryGrid( pckry );
      start();
      return true; // bind once
    });
    pckry.layout();
    equal( pckry.columnWidth, 32, 'columnWidth is set from element width, in percentage' );
  }

});

test( 'columnWidth, rowHeight, gutter via selector', function() {
  var container = document.querySelector('#gridded2');
  appendRandomSizedItems( container );

  var pckry = new Packery( container, {
    itemSelector: '.item',
    columnWidth: '.grid-sizer',
    rowHeight: '.grid-sizer',
    gutter: '.gutter-sizer'
  });

  equal( pckry.columnWidth, 30, 'columnWidth' );
  equal( pckry.rowHeight, 25, 'rowHeight' );
  equal( pckry.gutter, 10, 'gutter' );
});

})();
