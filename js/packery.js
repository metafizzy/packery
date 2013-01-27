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
var classie = window.classie;
var EventEmitter = window.EventEmitter;
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

// turn element or nodeList into an array
function makeArray( obj ) {
  var ary = [];
  if ( obj.length ) {
    // convert nodeList to array
    for ( var i=0, len = obj.length; i < len; i++ ) {
      ary.push( obj[i] );
    }
  } else {
    // array of single index
    ary.push( obj );
  }
  return ary;
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
  if ( !element ) {
    console.error( element + ' Packery element' );
    return;
  }

  this.element = element;

  // options
  this.options = {};
  extend( this.options, Packery.defaults );
  extend( this.options, options );

  // initial properties
  this.packer = new Packer();

  // kick it off
  this._create();
  this.layout();

}

// inherit EventEmitter
extend( Packery.prototype, EventEmitter.prototype );

Packery.defaults = {
  containerStyle: {
    position: 'relative'
  },
  isResizable: true,
  transitionDuration: '0.4s'
};

Packery.prototype._create = function() {
  this.layoutCount = 0;

  this.reloadItems();

  // collection of element that don't get laid out
  this.placedElements = [];
  if ( this.options.placedElements ) {
    this.place( this.options.placedElements );
  }

  var containerStyle = this.options.containerStyle;
  extend( this.element.style, containerStyle );

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
  var potentials = makeArray( elems );

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

Packery.prototype.layout = function() {
  // reset packer
  this.elementSize = getSize( this.element );

  this.packer.width = this.elementSize.innerWidth;
  this.packer.height = Number.POSITIVE_INFINITY;
  this.packer.reset();

  // layout
  this.maxY = 0;
  this.spacePlacedElements();
  this.layoutItems( this.items, !this._isInited );

  // flag for initalized
  this._isInited = true;
};

// _init is alias for layout
Packery.prototype._init = Packery.prototype.layout;

/**
 * layout a collection of item elements
 * @param {Array} items - array of elements
 * @param {Boolean} isStill - disable transitions for setting item position
 */
Packery.prototype.layoutItems = function( items, isStill ) {
  console.log('layout Items');
  var item;
  var layoutItemCount = this._getLayoutItemCount();
  var completedItemLayouts = 0;

  var _this = this;
  function onItemLayout( iItem ) {
    completedItemLayouts++;
    // console.log('completed itemLayouts', iItem._i );

    if ( completedItemLayouts === layoutItemCount ) {
      _this.layoutCount++;
      _this.emitEvent( 'layoutComplete', [ _this ] );
    }
    // listen once
    return true;
  }

  for ( var i=0, len = items.length; i < len; i++ ) {
    item = items[i];
    item._i = i;
    // ignore item
    if ( item.isIgnored ) {
      continue;
    }
    // listen to layout events for callback
    item.on( 'layout', onItemLayout );
    this._packItem( item );
    this._layoutItem( item, isStill );
  }

  // set container size
  this.element.style.height = this.maxY + 'px';
};

/**
 * get the number of un-ignored items that will be laid out
 * @returns {Number} count
 */
Packery.prototype._getLayoutItemCount = function() {
  var count = 0;
  for ( var i=0, len = this.items.length; i < len; i++ ) {
    count += this.items[i].isIgnored ? 0 : 1;
  }
  return count;
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

// -------------------------- place -------------------------- //

Packery.prototype.place = function( elems ) {
  elems = makeArray( elems );
  this.placedElements = this.placedElements.concat( elems );
};

Packery.prototype.unplace = function( elems ) {
  elems = makeArray( elems );
  var revised = [];
  var placedElem;
  // filter out removed place elements
  for ( var i=0, len = this.placedElements.length; i < len; i++ ) {
    placedElem = this.placedElements[i];
    if ( elems.indexOf( placedElem ) === -1 ) {
      revised.push( placedElem );
    }
  }

  this.placedElements = revised;
};

// make spaces for placed elements
Packery.prototype.spacePlacedElements = function() {
  var placedElems = this.placedElements;
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
  var x, y;
  var rect;

  var item = this.getItemFromElement( elem );
  if ( item && item.placedRect ) {
    rect = item.placedRect;
  } else {
    var boundingRect = elem.getBoundingClientRect();
    rect = new Rect({
      x: boundingRect.left - this._boundingLeft,
      y: boundingRect.top - this._boundingTop
    });
  }

  rect.width = size.outerWidth;
  rect.height = size.outerHeight;

  // save its space in the packer
  this.packer.placed( rect );

  this.maxY = Math.max( rect.y + rect.height, this.maxY );
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
  this.layout();

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
      // trigger callback
      if ( callback ) {
        callback( item, i );
      }
      // return item
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

Packery.prototype.unignore = function( elem ) {
  var item = this.getItemFromElement( elem );
  if ( item ) {
    delete item.isIgnored;
  }
};

Packery.prototype.sortItemsByPosition = function() {
  // console.log('sortItemsByPosition');
  for ( var i=0, len = this.items.length; i < len; i++ ) {
    this.items[i].getPosition();
  }
  this.items.sort( function( a, b ) {
    return a.position.y - b.position.y || a.position.x - b.position.x;
  });
};

// -------------------------- drag -------------------------- //

Packery.prototype.itemDragStart = function( elem ) {
  this.ignore( elem );
  this.place( elem );
};

Packery.prototype.itemDragMove = function( elem, x, y ) {
  var item = this.getItemFromElement( elem );
  if ( item ) {
    item.positionPlacedDragRect( x, y );
  }

  // debounce
  var _this = this;
  // use item for timer, or fall back to this
  var timer = item || this;
  function delayed() {
    _this.layout();
    delete timer._dragTimeout;
  }

  if ( timer._dragTimeout ) {
    clearTimeout( timer._dragTimeout );
  }

  timer._dragTimeout = setTimeout( delayed, 40 );
};

function onDragStoppedItemLayout( item ) {
  console.log('item was laid out');
  // do it once
  item.off( 'layout', onDragStoppedItemLayout );
}

Packery.prototype.itemDragStop = function( elem ) {
  var item = this.getItemFromElement( elem );
  // position item in grid
  var isItemGridded = item && ( this.options.columnWidth || this.options.rowHeight );
  var isItemLaidOut = !isItemGridded;
  var isPackeryLaidOut = false;
  var _this = this;
  function onLayoutComplete() {
    // only trigger when both are laid out
    // console.log('completeing clayout', isItemLaidOut, isPackeryLaidOut );
    if ( !isItemLaidOut || !isPackeryLaidOut ) {
      return;
    }
    if ( item ) {
      classie.remove( item.element, 'is-positioning-post-drag' );
    }

    _this.unignore( elem );
    _this.unplace( elem );
    // TODO do not sort when item never moved
    // if ( instance.position.x !== instance.startPosition.x || instance.position.y !== instance.startPosition.y ) {
    _this.sortItemsByPosition();
    // }
  }

  if ( item ) {
    classie.add( item.element, 'is-positioning-post-drag' );
  }

  if ( isItemGridded ) {
    item.on( 'layout', function onItemLayout( iItem ) {
      isItemLaidOut = true;
      onLayoutComplete();
      // listen once
      return true;
    });
    item.transitionPosition( item.placedRect.x, item.placedRect.y );
  }

  this.on( 'layoutComplete', function onPackeryLayoutComplete( packery ) {
    isPackeryLaidOut = true;
    onLayoutComplete();
    // listen once
    return true;
  });
  this.layout();

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
