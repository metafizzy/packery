function appendRandomSizedItems( container ) {
  var frag = document.createDocumentFragment();
  for ( var i=0; i < 35; i++ ) {
    var item = document.createElement('div');
    item.className = 'item';
    var w = Math.floor( Math.random() * Math.random() * 180 ) + 20;
    var h = Math.floor( Math.random() * Math.random() * 180 ) + 20;
    item.style.width  = w + 'px';
    item.style.height = h + 'px';
    frag.appendChild( item );
  }

  container.appendChild( frag );
}
