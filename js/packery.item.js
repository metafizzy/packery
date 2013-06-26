/**
 * Packery Item Element
**/

( function( window ) {

'use strict';

// dependencies
var Packery = window.Packery;
var Rect = Packery.Rect;
var getSize = window.getSize;
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
  // rect used for placing, in drag or Packery.fit()
  this.placeRect = new Rect();

  // style initial style
  this.element.style.position = 'absolute';
}

// inherit EventEmitter
extend( Item.prototype, EventEmitter.prototype );

// trigger specified handler for event type
Item.prototype.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

Item.prototype.getSize = function() {
  this.size = getSize( this.element );
};

/**
 * apply CSS styles to element
 * @param {Object} style
 */
Item.prototype.css = function( style ) {
  var elemStyle = this.element.style;
  for ( var prop in style ) {
    elemStyle[ prop ] = style[ prop ];
  }
};

 // measure position, and sets it
Item.prototype.getPosition = function() {
  var style = getStyle( this.element );

  var x = parseInt( style.left, 10 );
  var y = parseInt( style.top, 10 );

  // clean up 'auto' or other non-integer values
  x = isNaN( x ) ? 0 : x;
  y = isNaN( y ) ? 0 : y;
  // remove padding from measurement
  var packerySize = this.packery.elementSize;
  x -= packerySize.paddingLeft;
  y -= packerySize.paddingTop;

  this.position.x = x;
  this.position.y = y;
};

// transform translate function
var translate = is3d ?
  function( x, y ) {
    return 'translate3d( ' + x + 'px, ' + y + 'px, 0)';
  } :
  function( x, y ) {
    return 'translate( ' + x + 'px, ' + y + 'px)';
  };


Item.prototype._transitionTo = function( x, y ) {
  this.getPosition();
  // get current x & y from top/left
  var curX = this.position.x;
  var curY = this.position.y;

  var compareX = parseInt( x, 10 );
  var compareY = parseInt( y, 10 );
  var didNotMove = compareX === this.position.x && compareY === this.position.y;

  // save end position
  this.setPosition( x, y );

  // if did not move and not transitioning, just go to layout
  if ( didNotMove && !this.isTransitioning ) {
    this.layoutPosition();
    return;
  }

  var transX = x - curX;
  var transY = y - curY;
  var transitionStyle = {};
  transitionStyle[ transformCSSProperty ] = translate( transX, transY );

  this.transition( transitionStyle, this.layoutPosition );
};

// non transition + transform support
Item.prototype.goTo = function( x, y ) {
  this.setPosition( x, y );
  this.layoutPosition();
};

// use transition and transforms if supported
Item.prototype.moveTo = supportsCSS3 ?
  Item.prototype._transitionTo : Item.prototype.goTo;

Item.prototype.setPosition = function( x, y ) {
  this.position.x = parseInt( x, 10 );
  this.position.y = parseInt( y, 10 );
};

Item.prototype.layoutPosition = function() {
  var packerySize = this.packery.elementSize;
  this.css({
    // set settled position, apply padding
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
  this.css( style );
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
  var transitionStyle = {};
  transitionStyle[ transitionProperty + 'Property' ] = transitionValue.join(',');
  transitionStyle[ transitionProperty + 'Duration' ] = this.packery.options.transitionDuration;

  this.element.addEventListener( transitionEndEvent, this, false );

  // bind callback to transition end
  if ( onTransitionEnd ) {
    this.on( 'transitionEnd', function( _this ) {
      onTransitionEnd.call( _this );
      return true; // bind once
    });
  }

  // set transition styles
  this.css( transitionStyle );
  // set styles that are transitioning
  this.css( style );

  this.isTransitioning = true;
};

Item.prototype.transition = Item.prototype[ transitionProperty ? '_transition' : '_nonTransition' ];

Item.prototype.onwebkitTransitionEnd = function( event ) {
  this.ontransitionend( event );
};

Item.prototype.onotransitionend = function( event ) {
  this.ontransitionend( event );
};

Item.prototype.ontransitionend = function( event ) {
  // console.log('transition end');
  // disregard bubbled events from children
  if ( event.target !== this.element ) {
    return;
  }

  // trigger callback
  if ( this.onTransitionEnd ) {
    this.onTransitionEnd();
    delete this.onTransitionEnd;
  }

  this.removeTransitionStyles();
  // clean up transition styles
  var cleanStyle = {};
  for ( var prop in this.transitionStyle ) {
    cleanStyle[ prop ] = '';
  }

  this.css( cleanStyle );

  this.element.removeEventListener( transitionEndEvent, this, false );

  delete this.transitionStyle;

  this.isTransitioning = false;

  this.emitEvent( 'transitionEnd', [ this ] );
};

Item.prototype.removeTransitionStyles = function() {
  var noTransStyle = {};
  // remove transition
  noTransStyle[ transitionProperty + 'Property' ] = '';
  noTransStyle[ transitionProperty + 'Duration' ] = '';
  this.css( noTransStyle );
};

Item.prototype.remove = function() {
  // start transition
  var hiddenStyle = {
    opacity: 0
  };
  hiddenStyle[ transformCSSProperty ] = 'scale(0.001)';

  this.transition( hiddenStyle, this.removeElem );
};


// remove element from DOM
Item.prototype.removeElem = function() {
  this.element.parentNode.removeChild( this.element );
  this.emitEvent( 'remove', [ this ] );
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
  // hack for JSHint to hush about unused var
  h = null;
};

Item.prototype.destroy = function() {
  this.css({
    position: '',
    left: '',
    top: ''
  });
};

// -------------------------- drag -------------------------- //

Item.prototype.dragStart = function() {
  this.getPosition();
  this.removeTransitionStyles();
  // remove transform property from transition
  if ( this.isTransitioning && transformProperty ) {
    this.element.style[ transformProperty ] = 'none';
  }
  this.getSize();
  // create place rect, used for position when dragged then dropped
  // or when positioning
  this.isPlacing = true;
  this.needsPositioning = false;
  this.positionPlaceRect( this.position.x, this.position.y );
  this.isTransitioning = false;
  this.didDrag = false;
};

/**
 * handle item when it is dragged
 * @param {Number} x - horizontal position of dragged item
 * @param {Number} y - vertical position of dragged item
 */
Item.prototype.dragMove = function( x, y ) {
  this.didDrag = true;
  var packerySize = this.packery.elementSize;
  x -= packerySize.paddingLeft;
  y -= packerySize.paddingTop;
  this.positionPlaceRect( x, y );
};

Item.prototype.dragStop = function() {
  this.getPosition();
  var isDiffX = this.position.x !== this.placeRect.x;
  var isDiffY = this.position.y !== this.placeRect.y;
  // set post-drag positioning flag
  this.needsPositioning = isDiffX || isDiffY;
  // reset flag
  this.didDrag = false;
};

// -------------------------- placing -------------------------- //

/**
 * position a rect that will occupy space in the packer
 * @param {Number} x
 * @param {Number} y
 * @param {Boolean} isMaxYContained
 */
Item.prototype.positionPlaceRect = function( x, y, isMaxYOpen ) {
  this.placeRect.x = this.getPlaceRectCoord( x, true );
  this.placeRect.y = this.getPlaceRectCoord( y, false, isMaxYOpen );
};

/**
 * get x/y coordinate for place rect
 * @param {Number} coord - x or y
 * @param {Boolean} isX
 * @param {Boolean} isMaxOpen - does not limit value to outer bound
 * @returns {Number} coord - processed x or y
 */
Item.prototype.getPlaceRectCoord = function( coord, isX, isMaxOpen ) {
  var measure = isX ? 'Width' : 'Height';
  var size = this.size[ 'outer' + measure ];
  var segment = this.packery[ isX ? 'columnWidth' : 'rowHeight' ];
  var parentSize = this.packery.elementSize[ 'inner' + measure ];

  // additional parentSize calculations for Y
  if ( !isX ) {
    parentSize = Math.max( parentSize, this.packery.maxY );
    // prevent gutter from bumping up height when non-vertical grid
    if ( !this.packery.rowHeight ) {
      parentSize -= this.packery.gutter;
    }
  }

  var max;

  if ( segment ) {
    segment += this.packery.gutter;
    // allow for last column to reach the edge
    parentSize += isX ? this.packery.gutter : 0;
    // snap to closest segment
    coord = Math.round( coord / segment );
    // contain to outer bound
    // x values must be contained, y values can grow box by 1
    var maxSegments = Math[ isX ? 'floor' : 'ceil' ]( parentSize / segment );
    maxSegments -= Math.ceil( size / segment );
    max = maxSegments;
  } else {
    max = parentSize - size;
  }

  coord = isMaxOpen ? coord : Math.min( coord, max );
  coord *= segment || 1;

  return Math.max( 0, coord );
};

Item.prototype.copyPlaceRectPosition = function() {
  this.rect.x = this.placeRect.x;
  this.rect.y = this.placeRect.y;
};

// --------------------------  -------------------------- //

// publicize
Packery.Item = Item;

})( window );

