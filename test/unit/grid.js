QUnit.test( 'layout with columnWidth and rowHeight', function( assert ) {
  var container = document.querySelector('#gridded1');
  appendRandomSizedItems( container );

  var pckry = new Packery( container, {
    itemSelector: '.item',
    columnWidth: 25,
    rowHeight: 30
  });

  var done = assert.async();

  function checkPackeryGrid() {
    var colW = pckry.columnWidth + pckry.gutter;
    var rowH = pckry.rowHeight + pckry.gutter;
    for ( var i=0, len = pckry.items.length; i < len; i++ ) {
      var elem = pckry.items[i].element;
      var x = parseInt( elem.style.left, 10 );
      var y = parseInt( elem.style.top, 10 );
      assert.equal( x % colW, 0, 'item ' + i + ' x position is multiple of columnWidth' );
      assert.equal( y % rowH, 0, 'item ' + i + ' y position is multiple of rowHeight' );
    }
  }

  assert.equal( pckry.options.columnWidth, 25, 'columnWidth option is set' );
  assert.equal( pckry.options.rowHeight, 30, 'rowHeight option is set' );
  assert.equal( pckry.columnWidth, 25, 'columnWidth is set' );
  assert.equal( pckry.rowHeight, 30, 'rowHeight is set' );
  checkPackeryGrid( pckry );

  var gridSizer = container.querySelector('.grid-sizer');

  pckry.options.columnWidth = gridSizer;
  pckry.options.rowHeight = gridSizer;
  pckry.once( 'layoutComplete', function() {
    checkPackeryGrid( pckry );
    setTimeout( setGutter );
  });

  pckry.layout();

  assert.equal( pckry.columnWidth, 30, 'columnWidth is set from element width, in px' );
  assert.equal( pckry.rowHeight, 25, 'rowHeight is set from element height, in px' );

  function setGutter() {
    pckry.options.gutter = container.querySelector('.gutter-sizer');
    pckry.once( 'layoutComplete', function() {
      checkPackeryGrid( pckry );
      setTimeout( setPercentageGrid );
    });
    pckry.layout();
    assert.equal( pckry.gutter, 10, 'gutter set from element width, in px' );
  }

  function setPercentageGrid() {
    gridSizer.style.width = '40%';
    pckry.once( 'layoutComplete', function() {
      checkPackeryGrid( pckry );
      done();
    });
    pckry.layout();
    assert.equal( pckry.columnWidth, 32, 'columnWidth is set from element width, in percentage' );
  }

});

QUnit.test( 'columnWidth, rowHeight, gutter via selector', function( assert ) {
  var container = document.querySelector('#gridded2');
  appendRandomSizedItems( container );

  var pckry = new Packery( container, {
    itemSelector: '.item',
    columnWidth: '.grid-sizer',
    rowHeight: '.grid-sizer',
    gutter: '.gutter-sizer'
  });

  assert.equal( pckry.columnWidth, 30, 'columnWidth' );
  assert.equal( pckry.rowHeight, 25, 'rowHeight' );
  assert.equal( pckry.gutter, 10, 'gutter' );
});
