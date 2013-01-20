/**
 * Packery Item Element
**/

( function( window ) {

'use strict';

var Packery = window.Packery;

function Item( element ) {
  this.element = element;
  this.position = {
    x: 0,
    y: 0
  };

  // style initial style
  this.element.style.position = 'absolute';
}

Item.prototype.handleEvent = function( event ) {
  var method = event.type + 'Handler';
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

Item.prototype.css = function( style ) {
  var elemStyle = this.element.style;
  for ( var prop in style ) {
    elemStyle[ prop ] = style[ prop ];
  }
};

Item.prototype.transitionPosition = function( x, y ) {
  // save end position
  this.position.x = x;
  this.position.y = y;

  // get current x & y
  var elem = this.element;
  var curX = elem.style.left && parseInt( elem.style.left, 10 ) || 0;
  var curY = elem.style.top  && parseInt( elem.style.top,  10 ) || 0;

  var transX = x - curX;
  var transY = y - curY;

  // add event listener
  if ( !this.isTransitioning ) {
    this.onTransitionEnd = this.setEndPosition;
    elem.addEventListener( 'webkitTransitionEnd', this, false );
  }

  // start transition
  this.css({
    webkitTransition: '-webkit-transform 1s',
    webkitTransform: 'translate( ' + transX + 'px, ' + transY + 'px)'
  });

  this.isTransitioning = true;

};

Item.prototype.setEndPosition = function() {
  this.css({
    // set settled position
    left: this.position.x + 'px',
    top : this.position.y + 'px'
  });
};

Item.prototype.webkitTransitionEndHandler = function( event ) {
  if ( this.onTransitionEnd ) {
    this.onTransitionEnd();
  }

  this.css({
    // disable transition
    webkitTransform: '',
    // remove transform
    webkitTransition: ''
  });

  this.element.removeEventListener( 'webkitTransitionEnd', this, false );

  this.isTransitioning = false;
};

Item.prototype.remove = function() {
  console.log('hiding');
  // start transition
  this.css({
    webkitTransition: '-webkit-transform 1s, opacity 1s',
    opacity: 0,
    webkitTransform: 'scale(0.001)'
  });

  this.onTransitionEnd = this.removeElem;

  this.element.addEventListener( 'webkitTransitionEnd', this, false );

  this.isTransitioning = true;

};


// remove element from DOM
Item.prototype.removeElem = function() {
  console.log('removing elem');
  this.element.parentNode.removeChild( this.element );
};

// --------------------------  -------------------------- //

// publicize
Packery.Item = Item;

})( window );

