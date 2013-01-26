/**
 * Packery v0.0.1
 * Bin-packing layout
 * by David DeSandro / Metafizzy
 */

( function( window ) {

'use strict';

var document = window.document;
// Packery classes
var _Packery = window.Packery;
var Rect = _Packery.Rect;
var Packer = _Packery.Packer;
var Item = _Packery.Item;

// dependencies
var getSize = window.getSize;
var matchesSelector = window.matchesSelector;

// -------------------------- helpers -------------------------- //

// extend objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

// -------------------------- addEvent / removeEvent -------------------------- //

// by John Resig - http://ejohn.org/projects/flexible-javascript-events/

function addEvent( obj, type, fn ) {
  if ( obj.addEventListener ) {
    obj.addEventListener( type, fn, false );
  } else if ( obj.attachEvent ) {
    obj[ 'e' + type + fn ] = fn;
    obj[ type + fn ] = function() {
      obj[ 'e' + type + fn ]( window.event );
    };
    obj.attachEvent( "on" + type, obj[ type + fn ] );
  }
}

function removeEvent( obj, type, fn ) {
  if ( obj.removeEventListener ) {
    obj.removeEventListener( type, fn, false );
  } else if ( obj.detachEvent ) {
    obj.detachEvent( "on" + type, obj[ type + fn ] );
    delete obj[ type + fn ];
    delete obj[ 'e' + type + fn ];
  }
}

// -------------------------- Packery -------------------------- //

function Packery( element, options ) {
  this.element = element;

  // options
  this.options = {};
  extend( this.options, Packery.defaults );
  extend( this.options, options );

  // initial properties
  this.packer = new Packer();

  // kick it off
  this._create();
  this._init();

}



Packery.defaults = {
  containerStyle: {
    position: 'relative'
  },
  isResizable: true,
  transitionDuration: '0.4s'
};

Packery.prototype._create = function() {
  this.reloadItems();

  var containerStyle = this.options.containerStyle;
  for ( var prop in containerStyle ) {
    this.element.style[ prop ] = containerStyle[ prop ];
  }

  // bind resize method
  if ( this.options.isResizable ) {
    addEvent( window, 'resize', this );
  }

};

// goes through all children again and gets bricks in proper order
Packery.prototype.reloadItems = function() {
  // collection of item elements
  this.items = this._getItems( this.element.children );
},


/**
 * get item elements to be used in layout
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - item elements
 */
Packery.prototype._getItems = function( elems ) {

  // make array of elems
  var potentials = [];
  if ( elems.length ) {
    for ( var i=0, len = elems.length; i < len; i++ ) {
      potentials.push( elems[i] );
    }
  } else {
    potentials.push( elems );
  }

  var itemElems = [];
  var itemSelector = this.options.itemSelector;

  if ( itemSelector ) {
    // filter & find items if we have an item selector
    for ( var j=0, jLen = potentials.length; j < jLen; j++ ) {
      var potential = potentials[j];
      // filter
      if ( matchesSelector( potential, itemSelector ) ) {
        itemElems.push( potential );
      }
      // find
      var recentlyFound = potential.querySelectorAll( itemSelector );
      // concat recentlyFound to filterFound array
      for ( var k=0, kLen = recentlyFound.length; k < kLen; k++ ) {
        itemElems.push( recentlyFound[k] );
      }
    }
  } else {
    itemElems = potentials;
  }

  // style items
  var items = [];
  for ( var l=0, lLen = itemElems.length; l < lLen; l++ ) {
    var elem = itemElems[l];
    var item = new Item( elem, this );
    items.push( item );
  }

  return items;
},

Packery.prototype.getSize = function() {

};

// ----- init & layout ----- //

Packery.prototype._init = function() {
  // reset packer
  this.elementSize = getSize( this.element );

  this.packer.width = this.elementSize.innerWidth;
  this.packer.height = Number.POSITIVE_INFINITY;
  this.packer.reset();

  this.spacePlacedElements();

  // layout
  this.maxY = 0;
  this.layoutItems( this.items, !this._isInited );

  // flag for initalized
  this._isInited = true;
};

// make spaces for placed elements
Packery.prototype.spacePlacedElements = function() {
  var placedElems = this.options.placedElements;
  if ( !placedElems ) {
    return;
  }

  var elementBoundingRect = this.element.getBoundingClientRect();
  this._boundingLeft = elementBoundingRect.left + this.elementSize.paddingLeft;
  this._boundingTop  = elementBoundingRect.top  + this.elementSize.paddingTop;
  for ( var i=0, len = placedElems.length; i < len; i++ ) {
    var elem = placedElems[i];
    this.spacePlaced( elem );
  }
};

// makes space for element
Packery.prototype.spacePlaced = function( elem ) {
  var size = getSize( elem );
  var boundingRect = elem.getBoundingClientRect();
  // size a rect
  var rect = new Rect({
    width: size.outerWidth,
    height: size.outerHeight,
    x: boundingRect.left - this._boundingLeft,
    y: boundingRect.top  - this._boundingTop
  });

  // save its space in the packer
  this.packer.placed( rect );
};

/**
 * layout a collection of item elements
 * @param {Array} items - array of elements
 * @param {Boolean} isStill - disable transitions for setting item position
 */
Packery.prototype.layoutItems = function( items, isStill ) {
  var item;
  for ( var i=0, len = items.length; i < len; i++ ) {
    // console.log( i );
    item = items[i];
    if ( item.isIgnored ) {
      continue;
    }
    this._packItem( item );
    this._layoutItem( item, isStill );
  }

  // set container size
  this.element.style.height = this.maxY + 'px';
};

/**
 * layout item in packer
 * @param {Packery.Item} item
 */
Packery.prototype._packItem = function( item ) {
  // console.log( item );
  var size = getSize( item.element );
  var w = size.outerWidth;
  var h = size.outerHeight;
  // size for columnWidth and rowHeight, if available
  var colW = this.options.columnWidth;
  var rowH = this.options.rowHeight;
  w = colW ? Math.ceil( w / colW ) * colW : w;
  h = rowH ? Math.ceil( h / rowH ) * rowH : h;

  var rect = item.rect;
  rect.width = w;
  rect.height = h;
  // pack the rect in the packer
  this.packer.pack( rect );

  this.maxY = Math.max( rect.y + rect.height, this.maxY );
};

/**
 * Sets position of item in DOM
 * @param {Packery.Item} item
 * @param {Boolean} isStill - disables transitions
 */
Packery.prototype._layoutItem = function( item, isStill ) {

  // copy over position of packed rect to item element
  var rect = item.rect;
  if ( isStill ) {
    // if not transition, just set CSS
    item.setPosition( rect.x, rect.y );
    item.layoutPosition();
  } else {
    item.transitionPosition( rect.x, rect.y );
  }

};

// -------------------------- resize -------------------------- //

Packery.prototype.handleEvent = function( event ) {
  var method = event.type + 'Handler';
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};


// original debounce by John Hann
// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/

// this fires every resize
Packery.prototype.resizeHandler = function() {
  var _this = this;

  if ( this.resizeTimeout ) {
    clearTimeout( this.resizeTimeout );
  }

  function delayed() {
    _this.resize();
  }

  this.resizeTimeout = setTimeout( delayed, 100 );
};

// debounced, layout on resize
Packery.prototype.resize = function() {
  this._init();

  delete this.resizeTimeout;
};


// -------------------------- methods -------------------------- //


/**
 * Layout newly-appended item elements
 * @param {Array or NodeList or Element} elems
 */
Packery.prototype.appended = function( elems ) {
  var items = this._getItems( elems );
  if ( !items.length ) {
    return;
  }

  // add items to collection
  this.items = this.items.concat( items );

  // layout just the new items
  this.layoutItems( items, true );

  // reveal new items
  for ( var i=0, len = items.length; i < len; i++ ) {
    var item = items[i];
    item.reveal();
  }
};

Packery.prototype.getItemFromElement = function( elem, callback ) {
  // loop through items to get the one that matches
  var item;
  for ( var i=0, len = this.items.length; i < len; i++ ) {
    item = this.items[i];
    if ( item.element === elem ) {
      if ( callback ) {
        callback( item, i );
      }
      return item;
    }
  }
};

/**
 * remove element(s) from instance and DOM
 * @param {Array or NodeList or Element} elems
 */

// faux method, so we can pass in nodelist, element, or array
Packery.prototype.remove = function( elems ) {
  if ( elems.length ) {
    // multiple elements, remove 'em
    for ( var i=0, len = elems.length; i < len; i++ ) {
      this._remove( elems[i] );
    }
  } else {
    // single element, remove it
    this._remove( elems );
  }
};

Packery.prototype._remove = function( elem ) {
  var _this = this;
  this.getItemFromElement( elem, function( item, i ) {
    // remove item from collection
    item.remove();
    _this.items.splice( i, 1 );
  });
};

Packery.prototype.ignore = function( elem ) {
  var item = this.getItemFromElement( elem );
  if ( item ) {
    item.isIgnored = true;
  }
};

// ----- destroy ----- //

// remove and disable Packery instance
Packery.prototype.destroy = function() {
  // reset element styles
  this.element.style.position = '';
  this.element.style.height = '';

  // destroy items
  for ( var i=0, len = this.items.length; i < len; i++ ) {
    var item = this.items[i];
    item.destroy();
  }

  removeEvent( window, 'resize', this );
};

// -----  ----- //

// back in global
Packery.Rect = Rect;
Packery.Packer = Packer;
window.Packery = Packery;

})( window );
