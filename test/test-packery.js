/**
 * Packery tests
 */

( function( window ) {

'use strict';

module('Packery');

test( 'basics', function() {
  equal( typeof Packery === 'function', true, 'Packery is a function' );

  // var pckry = new Packery();
  // console.log( pckry, typeof pckry );
  // strictEqual( pckry, undefined, 'packery with no element returns undefined' );

});

window.onload = function onDocReady() {

  test( 'defaults / empty', function() {
    var pckry = new Packery( document.querySelector('#empty') );
    deepEqual( pckry.options, Packery.prototype.options, 'default options match prototype' );
    equal( pckry.items.length, 0, 'zero items' );
  });

  var ex1 = document.getElementById('ex1');
  var pack1 = new Packery( ex1, {
    itemSelector: '.item'
  });

  var ex2 = document.getElementById('ex2');
  var pack2 = new Packery( ex2, {
    itemSelector: '.item'
  });


  test( 'getItems', function() {
    equal( pack1.items.length, 6, 'filtered, itemSelector = .item, not all children' );
    equal( pack2.items.length, 4, 'found itemSelector = .item, querySelectoring' );
  });

  test( 'layout', function() {
    var elem0 = pack1.items[0].element;
    var elem1 = pack1.items[1].element;
    var elem2 = pack1.items[2].element;
    equal( elem0.style.left, '0px', 'first item left' );
    equal( elem0.style.top, '0px', 'first item left' );
    equal( elem1.style.left, '40px', '2nd item, 2nd column' );
    equal( elem1.style.top, '0px', '2nd item top' );
    equal( elem2.style.left, '0px', '3rd item, left' );
    equal( elem2.style.top, '20px', '3rd item, 2nd row' );

    // make elem smaller to change layout
    elem0.style.width = '18px';
    pack1.on( 'layoutComplete', function( obj ) {
      equal( true, true, 'layoutComplete event did fire' );
      equal( obj, pack1, 'event-emitted argument matches Packery instance' );
      equal( elem1.style.left, '20px', '2nd item, 2nd column' );
      equal( elem1.style.top, '0px', '2nd item left' );
      equal( elem2.style.left, '40px', '3rd item, 3rd column' );
      equal( elem2.style.top, '0px', '3rd item top' );
      start();
    });

    stop();
    pack1.layout();

  });

  function appendRandomSizedItems( container ) {
    var frag = document.createDocumentFragment();
    for ( var i=0; i < 10; i++ ) {
      var item = document.createElement('div');
      item.className = 'item';
      var w = Math.floor( Math.random() * Math.random() * 70 ) + 10;
      var h = Math.floor( Math.random() * Math.random() * 70 ) + 10;
      item.style.width  = w + 'px';
      item.style.height = h + 'px';
      frag.appendChild( item );
    }

    container.appendChild( frag );
  }

  var gridded = document.querySelector('#gridded');
  appendRandomSizedItems( gridded );

  test( 'layout with columnWidth and rowHeight', function() {
    var pckry = new Packery( gridded, {
      columnWidth: 20,
      rowHeight: 20
    });

    for ( var i=0, len = pckry.items.length; i < len; i++ ) {
      var elem = pckry.items[i].element;
      var x = parseInt( elem.style.left, 10 );
      var y = parseInt( elem.style.top, 10 );
      equal( x % pckry.options.columnWidth, 0, 'item ' + i + ' x position is multiple of columnWidth' );
      equal( y % pckry.options.rowHeight, 0, 'item ' + i + ' y position is multiple of rowHeight' );
    }

  });


  test( 'remove', function() {
    var container = document.querySelector('#add-remove');
    // packery starts with 4 items
    var pckry = new Packery( container, {
      itemSelector: '.item'
    });
    // remove two items
    pckry.on( 'removeComplete', function( obj ) {
      equal( true, true, 'removeComplete event did fire' );
      equal( obj, pckry, 'event-emitted argument matches Packery instance' );
      equal( container.children.length, 2, 'elements removed from DOM' );
      equal( container.querySelectorAll('.w2').length, 0, 'matched elements were removed' );
      start();
    });
    pckry.remove( container.querySelectorAll('.w2') );
    equal( pckry.items.length, 2, 'items removed from Packery instance' );

    stop();
  });

};


})( window );
