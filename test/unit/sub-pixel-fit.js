QUnit.test( 'sub-pixel fit', function( assert ) {

  var pckry = new Packery( '#sub-pixel-fit', {
    itemSelector: '.item',
    transitionDuration: 0
  });

  function getItemsTotalY() {
    var y = 0;
    for ( var i=0, len = pckry.items.length; i < len; i++ ) {
      var item = pckry.items[i];
      y += item.rect.y;
    }
    return y;
  }

  // iterate over multiple container widths
  for ( var containerWidth = 290; containerWidth < 310; containerWidth++ ) {
    pckry.element.style.width = containerWidth + 'px';
    pckry.layout();
    assert.equal( 0, getItemsTotalY(), 'items fit at ' + containerWidth + 'px' );
  }

  // set grid sizer and do it again
  pckry.options.columnWidth = '.grid-sizer';

  for ( containerWidth = 290; containerWidth < 310; containerWidth++ ) {
    pckry.element.style.width = containerWidth + 'px';
    pckry.layout();
    assert.equal( 0, getItemsTotalY(), 'items fit with columnWidth at ' + containerWidth + 'px' );
  }

});
