// ----- jQuery ----- //

var Packery = require('../../js/packery');
var Draggabilly = require('draggabilly');
var $ = require('jquery');
var jQBridget = require('jquery-bridget');

$.bridget( 'packery', Packery );

var $container = $('#basic').packery({
  columnWidth: 50,
  rowHeight: 50
});

var pckry = $container.data('packery');

$.each( pckry.items, function( i, item ) {
  var draggie = new Draggabilly( item.element );
  $container.packery( 'bindDraggabillyEvents', draggie );
});

$container.packery( 'on', 'dragItemPositioned', function( pckry, item ) {
  console.log( 'drag item positioned', item.position.x, item.position.y );
});
