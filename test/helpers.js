( function( window ) {

'use strict';

window.appendRandomSizedItems = function( container ) {
  var frag = document.createDocumentFragment();
  var item;
  for ( var i=0; i < 9; i++ ) {
    item = document.createElement('div');
    item.className = 'item';
    var w = Math.floor( Math.random() * Math.random() * 70 ) + 10;
    var h = Math.floor( Math.random() * Math.random() * 70 ) + 10;
    item.style.width  = w + 'px';
    item.style.height = h + 'px';
    frag.appendChild( item );
  }

  // last one isn't random, but is needed for checking
  // bigger than colum width and stuff
  item = document.createElement('div');
  item.className = 'item';
  item.style.width  = '72px';
  item.style.height = '25px';
  frag.appendChild( item );

  container.appendChild( frag );
};

window.gimmeAnItemElement = function() {
  var elem = document.createElement('div');
  elem.className = 'item';
  return elem;
};

})( window );
