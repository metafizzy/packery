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

  test( 'getItems', function() {
    var ex1 = document.getElementById('ex1');
    var pack1 = new Packery( ex1, {
      itemSelector: '.item'
    });

    equal( pack1.items.length, 6, 'filtered, itemSelector = .item, not all children' );

    var ex2 = document.getElementById('ex2');
    var pack2 = new Packery( ex2, {
      itemSelector: '.item'
    });

    equal( pack2.items.length, 4, 'found itemSelector = .item, querySelectoring' );

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
      start();
    });
    pckry.remove( container.querySelectorAll('.w2') );
    equal( pckry.items.length, 2, 'items removed from Packery instance' );

    stop();
  });

};


})( window );
