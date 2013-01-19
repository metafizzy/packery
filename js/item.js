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

  // start transition
  this.css({
    webkitTransition: '-webkit-transform 1s',
    webkitTransform: 'translate( ' + transX + 'px, ' + transY + 'px)'
  });

  // add event listener
  if ( !this.isTransitioning ) {
    elem.addEventListener( 'webkitTransitionEnd', this, false );
  }

  this.isTransitioning = true;

};

Item.prototype.webkitTransitionEndHandler = function( event ) {
  this.css({  
    // disable transition
    webkitTransform: '',
    // remove transform
    webkitTransition: '',
    // set settled position
    left: this.position.x + 'px',
    top : this.position.y + 'px'
  });

  this.element.removeEventListener( 'webkitTransitionEnd', this, false );

  this.isTransitioning = false;
};


// --------------------------  -------------------------- //

// publicize
Packery.Item = Item;

})( window );

