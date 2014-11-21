// ----- vanilla JS ----- //

var Packery = require('../../js/packery');
var Draggabilly = require('draggabilly');

var pckry = new Packery( '#basic', {
  columnWidth: 50,
  rowHeight: 50
});

var draggies = [];
var item, draggie;

for ( var i=0, len = pckry.items.length; i < len; i++ ) {
  item = pckry.items[i].element;
  draggie = new Draggabilly( item );
  pckry.bindDraggabillyEvents( draggie );
  draggies.push( draggie );
}

pckry.on( 'dragItemPositioned', function( pckry, item ) {
  console.log( 'drag item positioned', item.position.x, item.position.y );
});
