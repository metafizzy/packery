/**
 * Packery Item Element
**/

( function( window ) {

'use strict';

// dependencies
var Packery = window.Packery;
var Rect = Packery.Rect;
var getStyleProperty = window.getStyleProperty;
var EventEmitter = window.EventEmitter;

// ----- get style ----- //

var defView = document.defaultView;

var getStyle = defView && defView.getComputedStyle ?
  function( elem ) {
    return defView.getComputedStyle( elem, null );
  } :
  function( elem ) {
    return elem.currentStyle;
  };


// extend objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

// -------------------------- CSS3 support -------------------------- //

var transitionProperty = getStyleProperty('transition');
var transformProperty = getStyleProperty('transform');
var supportsCSS3 = transitionProperty && transformProperty;
var is3d = !!getStyleProperty('perspective');

var transitionEndEvent = {
  WebkitTransition: 'webkitTransitionEnd',
  MozTransition: 'transitionend',
  OTransition: 'otransitionend',
  transition: 'transitionend'
}[ transitionProperty ];

var transitionCSSProperty = {
  WebkitTransition: '-webkit-transition',
  MozTransition: '-moz-transition',
  OTransition: '-o-transition',
  transition: 'transition'
}[ transitionProperty ];

var transformCSSProperty = {
  WebkitTransform: '-webkit-transform',
  MozTransform: '-moz-transform',
  OTransform: '-o-transform',
  transform: 'transform'
}[ transformProperty ];

// -------------------------- Item -------------------------- //

function Item( element, packery ) {
  this.element = element;
  this.packery = packery;
  this.position = {
    x: 0,
    y: 0
  };

  this.rect = new Rect();

  // style initial style
  this.element.style.position = 'absolute';
}

// inherit EventEmitter
extend( Item.prototype, EventEmitter.prototype );

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

Item.prototype.getPosition = function() {
  var style = getStyle( this.element );

  var x = parseInt( style.left, 10 );
  var y = parseInt( style.top, 10 );

  // clean up 'auto' or other non-integer values
  this.position.x = isNaN( x ) ? 0 : x;
  this.position.y = isNaN( y ) ? 0 : y;
};

// transform translate function
var translate = is3d ?
  function( x, y ) {
    return 'translate3d( ' + x + 'px, ' + y + 'px, 0)';
  } :
  function( x, y ) {
    return 'translate( ' + x + 'px, ' + y + 'px)';
  };


Item.prototype._transitionPosition = function( x, y ) {
  this.getPosition();
  // get current x & y from top/left
  var curX = this.position.x;
  var curY = this.position.y;

  var packerySize = this.packery.elementSize;
  var compareX = parseInt( x, 10 ) + packerySize.paddingLeft;
  var compareY = parseInt( y, 10 ) + packerySize.paddingTop;
  var didNotMove = compareX === this.position.x && compareY === this.position.y;

  // save end position
  this.setPosition( x, y );

  // if did not move and not transitioning, just go to layout
  if ( didNotMove && !this.isTransitioning ) {
    this.layoutPosition();
    return;
  }

  var transX = ( x - curX ) + packerySize.paddingLeft;
  var transY = ( y - curY ) + packerySize.paddingTop;

  var transitionStyle = {};
  transitionStyle[ transformCSSProperty ] = translate( transX, transY );

  this.transition( transitionStyle, this.layoutPosition );
};

Item.prototype._noTransitionPosition = function( x, y ) {
  this.setPosition( x, y );
  this.layoutPosition();
};

Item.prototype.transitionPosition = supportsCSS3 ?
  Item.prototype._transitionPosition : Item.prototype._noTransitionPosition;

Item.prototype.setPosition = function( x, y ) {
  this.position.x = parseInt( x, 10 );
  this.position.y = parseInt( y, 10 );
};

Item.prototype.layoutPosition = function() {
  var packerySize = this.packery.elementSize;
  this.css({
    // set settled position
    left: ( this.position.x + packerySize.paddingLeft ) + 'px',
    top : ( this.position.y + packerySize.paddingTop ) + 'px'
  });
  this.emitEvent( 'layout', [ this ] );
};

/**
 * @param {Object} style - CSS
 * @param {Function} onTransitionEnd
 */

// non transition, just trigger callback
Item.prototype._nonTransition = function( style, onTransitionEnd ) {
  if ( onTransitionEnd ) {
    onTransitionEnd.call( this );
  }
};

// proper transition
Item.prototype._transition = function( style, onTransitionEnd ) {
  this.transitionStyle = style;

  var transitionValue = [];
  for ( var prop in style ) {
    transitionValue.push( prop );
  }

  // enable transition
  style[ transitionProperty + 'Property' ] = transitionValue.join(',');
  style[ transitionProperty + 'Duration' ] = this.packery.options.transitionDuration;

  this.element.addEventListener( transitionEndEvent, this, false );

  // transition end callback
  this.onTransitionEnd = onTransitionEnd;

  // set transition styles
  this.css( style );

  this.isTransitioning = true;
};

Item.prototype.transition = Item.prototype[ transitionProperty ? '_transition' : '_nonTransition' ];

Item.prototype.webkitTransitionEndHandler = function( event ) {
  this.transitionendHandler( event );
};

Item.prototype.otransitionendHandler = function( event ) {
  this.transitionendHandler( event );
};

console.log( transitionEndEvent );

Item.prototype.transitionendHandler = function( event ) {
  // console.log('transition end');
  // disregard bubbled events from children
  if ( event.target !== this.element ) {
    return;
  }

  if ( this.onTransitionEnd ) {
    this.onTransitionEnd();
    delete this.onTransitionEnd;
  }

  // clean up transition styles
  var elemStyle = this.element.style;
  var cleanStyle = {};
  // remove transition
  cleanStyle[ transitionProperty + 'Property' ] = '';
  cleanStyle[ transitionProperty + 'Duration' ] = '';

  for ( var prop in this.transitionStyle ) {
    cleanStyle[ prop ] = '';
  }

  this.css( cleanStyle );

  this.element.removeEventListener( transitionEndEvent, this, false );

  delete this.transitionStyle;

  this.isTransitioning = false;
};

Item.prototype.remove = function() {
  console.log('hiding');
  // start transition

  var hiddenStyle = {
    opacity: 0
  };
  hiddenStyle[ transformCSSProperty ] = 'scale(0.001)';

  this.transition( hiddenStyle, this.removeElem );

};


// remove element from DOM
Item.prototype.removeElem = function() {
  console.log('removing elem');
  this.element.parentNode.removeChild( this.element );
};

Item.prototype.reveal = !transitionProperty ? function() {} : function() {
  // hide item
  var hiddenStyle = {
    opacity: 0
  };
  hiddenStyle[ transformCSSProperty ] = 'scale(0.001)';
  this.css( hiddenStyle );
  // force redraw. http://blog.alexmaccaw.com/css-transitions
  var h = this.element.offsetHeight;
  // transition to revealed
  var visibleStyle = {
    opacity: 1
  };
  visibleStyle[ transformCSSProperty ] = 'scale(1)';
  this.transition( visibleStyle );

};

// TODO jsDoc this
Item.prototype.positionPlacedDragRect = function( x, y ) {
  var options = this.packery.options;
  var packerySize = this.packery.elementSize;

  var rectX = x - packerySize.paddingLeft;
  var rectY = y - packerySize.paddingTop;
  // apply grid
  var columnWidth = options.columnWidth;
  var rowHeight = options.rowHeight;
  if ( columnWidth ) {
    rectX = Math.round( rectX / columnWidth ) * columnWidth;
  }
  if ( rowHeight ) {
    rectY = Math.round( rectY / rowHeight ) * rowHeight;
  }

  // keep track of rect
  this.placedRect = this.placedRect || new Rect();
  this.placedRect.x = rectX;
  this.placedRect.y = rectY;
};



Item.prototype.destroy = function() {
  this.css({
    position: '',
    left: '',
    top: ''
  });
};

// --------------------------  -------------------------- //

// publicize
Packery.Item = Item;

})( window );

