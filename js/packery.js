/*!
 * Packery v1.0.6
 * bin-packing layout library
 * http://packery.metafizzy.co
 *
 * Commercial use requires one-time purchase of a commercial license
 * http://packery.metafizzy.co/license.html
 *
 * Non-commercial use is licensed under the MIT License
 *
 * Copyright 2013 Metafizzy
 */

( function( window ) {

'use strict';

// Packery classes
var _Packery = window.Packery;
var Rect = _Packery.Rect;
var Packer = _Packery.Packer;
var Item = _Packery.Item;

// dependencies
var classie = window.classie;
var docReady = window.docReady;
var EventEmitter = window.EventEmitter;
var eventie = window.eventie;
var getSize = window.getSize;
var matchesSelector = window.matchesSelector;

// ----- vars ----- //

var document = window.document;
var console = window.console;
var jQuery = window.jQuery;

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
  if ( typeof obj.length === 'number' ) {
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

// http://stackoverflow.com/a/384380/182183
var isElement = ( typeof HTMLElement === 'object' ) ?
  function isElementDOM2( obj ) {
    return obj instanceof HTMLElement;
  } :
  function isElementQuirky( obj ) {
    return obj && typeof obj === 'object' &&
      obj.nodeType === 1 && typeof obj.nodeName === 'string';
  };

// index of helper cause IE8
var indexOf = Array.prototype.indexOf ? function( ary, obj ) {
    return ary.indexOf( obj );
  } : function( ary, obj ) {
    for ( var i=0, len = ary.length; i < len; i++ ) {
      if ( ary[i] === obj ) {
        return i;
      }
    }
    return -1;
  };


// -------------------------- Packery -------------------------- //

// globally unique identifiers
var GUID = 0;
// internal store of all Packery intances
var packeries = {};

function Packery( element, options ) {
  // bail out if not proper element
  if ( !element || !isElement( element ) ) {
    if ( console ) {
      console.error( 'bad Packery element: ' + element );
    }
    return;
  }

  this.element = element;

  // options
  this.options = extend( {}, this.options );
  extend( this.options, options );

  // add id for Packery.getFromElement
  var id = ++GUID;
  this.element.packeryGUID = id; // expando
  packeries[ id ] = this; // associate via id

  // kick it off
  this._create();

  if ( this.options.isInitLayout ) {
    this.layout();
  }
}

// inherit EventEmitter
extend( Packery.prototype, EventEmitter.prototype );

// default options
Packery.prototype.options = {
  containerStyle: {
    position: 'relative'
  },
  isInitLayout: true,
  isResizeBound: true,
  transitionDuration: '0.4s'
};

Packery.prototype._create = function() {
  // initial properties
  this.packer = new Packer();
  // get items from children
  this.reloadItems();
  // collection of element that don't get laid out
  this.stampedElements = [];
  this.stamp( this.options.stamped );

  var containerStyle = this.options.containerStyle;
  extend( this.element.style, containerStyle );

  // bind resize method
  if ( this.options.isResizeBound ) {
    this.bindResize();
  }

  // create drag handlers
  var _this = this;
  this.handleDraggabilly = {
    dragStart: function( draggie ) {
      _this.itemDragStart( draggie.element );
    },
    dragMove: function( draggie ) {
      _this.itemDragMove( draggie.element, draggie.position.x, draggie.position.y );
    },
    dragEnd: function( draggie ) {
      _this.itemDragEnd( draggie.element );
    }
  };

  this.handleUIDraggable = {
    start: function handleUIDraggableStart( event ) {
      _this.itemDragStart( event.currentTarget );
    },
    drag: function handleUIDraggableDrag( event, ui ) {
      _this.itemDragMove( event.currentTarget, ui.position.left, ui.position.top );
    },
    stop: function handleUIDraggableStop( event ) {
      _this.itemDragEnd( event.currentTarget );
    }
  };

};

// goes through all children again and gets bricks in proper order
Packery.prototype.reloadItems = function() {
  // collection of item elements
  this.items = this._getItems( this.element.children );
};


/**
 * get item elements to be used in layout
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - collection of new Packery Items
 */
Packery.prototype._getItems = function( elems ) {

  var itemElems = this._filterFindItemElements( elems );

  // create new Packery Items for collection
  var items = [];
  for ( var i=0, len = itemElems.length; i < len; i++ ) {
    var elem = itemElems[i];
    var item = new Item( elem, this );
    items.push( item );
  }

  return items;
};

/**
 * get item elements to be used in layout
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - item elements
 */
Packery.prototype._filterFindItemElements = function( elems ) {
  // make array of elems
  elems = makeArray( elems );
  var itemSelector = this.options.itemSelector;

  if ( !itemSelector ) {
    return elems;
  }

  var itemElems = [];

  // filter & find items if we have an item selector
  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    // filter siblings
    if ( matchesSelector( elem, itemSelector ) ) {
      itemElems.push( elem );
    }
    // find children
    var childElems = elem.querySelectorAll( itemSelector );
    // concat childElems to filterFound array
    for ( var j=0, jLen = childElems.length; j < jLen; j++ ) {
      itemElems.push( childElems[j] );
    }
  }

  return itemElems;
};

/**
 * getter method for getting item elements
 * @returns {Array} elems - collection of item elements
 */
Packery.prototype.getItemElements = function() {
  var elems = [];
  for ( var i=0, len = this.items.length; i < len; i++ ) {
    elems.push( this.items[i].element );
  }
  return elems;
};

// ----- init & layout ----- //

/**
 * lays out all items
 */
Packery.prototype.layout = function() {
  this._prelayout();

  // don't animate first layout
  var isInstant = this.options.isLayoutInstant !== undefined ?
    this.options.isLayoutInstant : !this._isLayoutInited;
  this.layoutItems( this.items, isInstant );

  // flag for initalized
  this._isLayoutInited = true;
};

// _init is alias for layout
Packery.prototype._init = Packery.prototype.layout;

/**
 * logic before any new layout
 */
Packery.prototype._prelayout = function() {
  // reset packer
  this.elementSize = getSize( this.element );

  this._getMeasurements();

  this.packer.width = this.elementSize.innerWidth + this.gutter;
  this.packer.height = Number.POSITIVE_INFINITY;
  this.packer.reset();

  // layout
  this.maxY = 0;
  this.placeStampedElements();
};

/**
 * update columnWidth, rowHeight, & gutter
 * @private
 */
Packery.prototype._getMeasurements = function() {
  this._getMeasurement( 'columnWidth', 'width' );
  this._getMeasurement( 'rowHeight', 'height' );
  this._getMeasurement( 'gutter', 'width' );
};

/**
 * get measurement from option, for columnWidth, rowHeight, gutter
 * if option is String -> get element from selector string, & get size of element
 * if option is Element -> get size of element
 * else use option as a number
 *
 * @param {String} measurement
 * @param {String} size - width or height
 * @private
 */
Packery.prototype._getMeasurement = function( measurement, size ) {
  var option = this.options[ measurement ];
  var elem;
  if ( !option ) {
    // default to 0
    this[ measurement ] = 0;
  } else {
    if ( typeof option === 'string' ) {
      elem = this.element.querySelector( option );
    } else if ( isElement( option ) ) {
      elem = option;
    }
    // use size of element, if element
    this[ measurement ] = elem ? getSize( elem )[ size ] : option;
  }
};

/**
 * layout a collection of item elements
 * @param {Array} items - array of Packery.Items
 * @param {Boolean} isInstant - disable transitions for setting item position
 */
Packery.prototype.layoutItems = function( items, isInstant ) {
  // console.log('layout Items');
  var layoutItems = this._getLayoutItems( items );

  if ( !layoutItems || !layoutItems.length ) {
    // no items, just emit layout complete with empty array
    this.emitEvent( 'layoutComplete', [ this, [] ] );
  } else {
    this._itemsOn( layoutItems, 'layout', function onItemsLayout() {
      this.emitEvent( 'layoutComplete', [ this, layoutItems ] );
    });

    for ( var i=0, len = layoutItems.length; i < len; i++ ) {
      var item = layoutItems[i];
      // listen to layout events for callback
      this._packItem( item );
      this._layoutItem( item, isInstant );
    }
  }

  // set container size
  var elemSize = this.elementSize;
  var elemH = this.maxY - this.gutter;
  // add padding and border width if border box
  if ( elemSize.isBorderBox ) {
    elemH += elemSize.paddingBottom + elemSize.paddingTop +
      elemSize.borderTopWidth + elemSize.borderBottomWidth;
  }
  // prevent negative size, which causes error in IE
  elemH = Math.max( elemH, 0 );
  this.element.style.height = elemH + 'px';
};

/**
 * filters items for non-ignored items
 * @param {Array} items
 * @returns {Array} layoutItems
 */
Packery.prototype._getLayoutItems = function( items ) {
  var layoutItems = [];
  for ( var i=0, len = items.length; i < len; i++ ) {
    var item = items[i];
    if ( !item.isIgnored ) {
      layoutItems.push( item );
    }
  }
  return layoutItems;
};

/**
 * layout item in packer
 * @param {Packery.Item} item
 */
Packery.prototype._packItem = function( item ) {
  this._setRectSize( item.element, item.rect );
  // pack the rect in the packer
  this.packer.pack( item.rect );
  this._setMaxY( item.rect );
};

/**
 * set max Y value, for height of container
 * @param {Packery.Rect} rect
 * @private
 */
Packery.prototype._setMaxY = function( rect ) {
  this.maxY = Math.max( rect.y + rect.height, this.maxY );
};

/**
 * set the width and height of a rect, applying columnWidth and rowHeight
 * @param {Element} elem
 * @param {Packery.Rect} rect
 */
Packery.prototype._setRectSize = function( elem, rect ) {
  var size = getSize( elem );
  var w = size.outerWidth;
  var h = size.outerHeight;
  // size for columnWidth and rowHeight, if available
  var colW = this.columnWidth + this.gutter;
  var rowH = this.rowHeight + this.gutter;
  w = this.columnWidth ? Math.ceil( w / colW ) * colW : w + this.gutter;
  h = this.rowHeight ? Math.ceil( h / rowH ) * rowH : h + this.gutter;
  // rect must fit in packer
  rect.width = Math.min( w, this.packer.width );
  rect.height = h;
};

/**
 * Sets position of item in DOM
 * @param {Packery.Item} item
 * @param {Boolean} isInstant - disables transitions
 */
Packery.prototype._layoutItem = function( item, isInstant ) {

  // copy over position of packed rect to item element
  var rect = item.rect;
  if ( isInstant ) {
    // if not transition, just set CSS
    item.goTo( rect.x, rect.y );
  } else {
    item.moveTo( rect.x, rect.y );
  }

};

/**
 * trigger a callback for a collection of items events
 * @param {Array} items - Packery.Items
 * @param {String} eventName
 * @param {Function} callback
 */
Packery.prototype._itemsOn = function( items, eventName, callback ) {
  var doneCount = 0;
  var count = items.length;
  // event callback
  var _this = this;
  function tick() {
    doneCount++;
    if ( doneCount === count ) {
      callback.call( _this );
    }
    return true; // bind once
  }
  // bind callback
  for ( var i=0, len = items.length; i < len; i++ ) {
    var item = items[i];
    item.on( eventName, tick );
  }
};

// -------------------------- stamp -------------------------- //

/**
 * adds elements to stampedElements
 * @param {NodeList, Array, Element, or String} elems
 */
Packery.prototype.stamp = function( elems ) {
  if ( !elems ) {
    return;
  }
  // if string, use argument as selector string
  if ( typeof elems === 'string' ) {
    elems = this.element.querySelectorAll( elems );
  }
  elems = makeArray( elems );
  this.stampedElements.push.apply( this.stampedElements, elems );
  // ignore
  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    this.ignore( elem );
  }
};

/**
 * removes elements to stampedElements
 * @param {NodeList, Array, or Element} elems
 */
Packery.prototype.unstamp = function( elems ) {
  if ( !elems ){
    return;
  }
  elems = makeArray( elems );

  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    // filter out removed stamp elements
    var index = indexOf( this.stampedElements, elem );
    if ( index !== -1 ) {
      this.stampedElements.splice( index, 1 );
    }
    this.unignore( elem );
  }

};

// make spaces for stamped elements
Packery.prototype.placeStampedElements = function() {
  if ( !this.stampedElements || !this.stampedElements.length ) {
    return;
  }

  this._getBounds();

  for ( var i=0, len = this.stampedElements.length; i < len; i++ ) {
    var elem = this.stampedElements[i];
    this.placeStamp( elem );
  }
};

// update boundingLeft / Top
Packery.prototype._getBounds = function() {
  // get bounding rect for container element
  var elementBoundingRect = this.element.getBoundingClientRect();
  this._boundingLeft = elementBoundingRect.left + this.elementSize.paddingLeft;
  this._boundingTop  = elementBoundingRect.top  + this.elementSize.paddingTop;
};

/**
 * makes space for element
 * @param {Element} elem
 */
Packery.prototype.placeStamp = function( elem ) {
  var item = this.getItem( elem );
  var rect;
  if ( item && item.isPlacing ) {
    rect = item.placeRect;
  } else {
    rect = this._getElementOffsetRect( elem );
  }

  this._setRectSize( elem, rect );
  // save its space in the packer
  this.packer.placed( rect );
  this._setMaxY( rect );
};

/**
 * get x/y position of element relative to container element
 * @param {Element} elem
 * @returns {Rect} rect
 */
Packery.prototype._getElementOffsetRect = function( elem ) {
  var boundingRect = elem.getBoundingClientRect();
  var rect = new Rect({
    x: boundingRect.left - this._boundingLeft,
    y: boundingRect.top - this._boundingTop
  });
  rect.x -= this.elementSize.borderLeftWidth;
  rect.y -= this.elementSize.borderTopWidth;
  return rect;
};

// -------------------------- resize -------------------------- //

// enable event handlers for listeners
// i.e. resize -> onresize
Packery.prototype.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

/**
 * Bind layout to window resizing
 */
Packery.prototype.bindResize = function() {
  // bind just one listener
  if ( this.isResizeBound ) {
    return;
  }
  eventie.bind( window, 'resize', this );
  this.isResizeBound = true;
};

/**
 * Unbind layout to window resizing
 */
Packery.prototype.unbindResize = function() {
  eventie.unbind( window, 'resize', this );
  this.isResizeBound = false;
};

// original debounce by John Hann
// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/

// this fires every resize
Packery.prototype.onresize = function() {
  if ( this.resizeTimeout ) {
    clearTimeout( this.resizeTimeout );
  }

  var _this = this;
  function delayed() {
    _this.resize();
  }

  this.resizeTimeout = setTimeout( delayed, 100 );
};

// debounced, layout on resize
Packery.prototype.resize = function() {
  // don't trigger if size did not change
  var size = getSize( this.element );
  // check that elementSize and size are there
  // IE8 triggers resize on body size change, so they might not be
  var hasSizes = this.elementSize && size;
  if ( hasSizes && size.innerWidth === this.elementSize.innerWidth ) {
    return;
  }

  this.layout();

  delete this.resizeTimeout;
};


// -------------------------- methods -------------------------- //

/**
 * add items to Packery instance
 * @param {Array or NodeList or Element} elems
 * @returns {Array} items - Packery.Items
**/
Packery.prototype.addItems = function( elems ) {
  var items = this._getItems( elems );
  if ( !items.length ) {
    return;
  }
  // add items to collection
  this.items.push.apply( this.items, items );
  return items;
};

/**
 * Layout newly-appended item elements
 * @param {Array or NodeList or Element} elems
 */
Packery.prototype.appended = function( elems ) {
  var items = this.addItems( elems );
  if ( !items.length ) {
    return;
  }
  // layout and reveal just the new items
  this.layoutItems( items, true );
  this.reveal( items );
};

/**
 * Layout prepended elements
 * @param {Array or NodeList or Element} elems
 */
Packery.prototype.prepended = function( elems ) {
  var items = this._getItems( elems );
  if ( !items.length ) {
    return;
  }
  // add items to beginning of collection
  var previousItems = this.items.slice(0);
  this.items = items.concat( previousItems );
  // start new layout
  this._prelayout();
  // layout new stuff without transition
  this.layoutItems( items, true );
  this.reveal( items );
  // layout previous items
  this.layoutItems( previousItems );
};

// reveal a collection of items
Packery.prototype.reveal = function( items ) {
  if ( !items || !items.length ) {
    return;
  }
  for ( var i=0, len = items.length; i < len; i++ ) {
    var item = items[i];
    item.reveal();
  }
};

/**
 * get Packery.Item, given an Element
 * @param {Element} elem
 * @param {Function} callback
 * @returns {Packery.Item} item
 */
Packery.prototype.getItem = function( elem ) {
  // loop through items to get the one that matches
  for ( var i=0, len = this.items.length; i < len; i++ ) {
    var item = this.items[i];
    if ( item.element === elem ) {
      // return item
      return item;
    }
  }
};

/**
 * get collection of Packery.Items, given Elements
 * @param {Array} elems
 * @returns {Array} items - Packery.Items
 */
Packery.prototype.getItems = function( elems ) {
  if ( !elems || !elems.length ) {
    return;
  }
  var items = [];
  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    var item = this.getItem( elem );
    if ( item ) {
      items.push( item );
    }
  }

  return items;
};

/**
 * remove element(s) from instance and DOM
 * @param {Array or NodeList or Element} elems
 */
Packery.prototype.remove = function( elems ) {
  elems = makeArray( elems );

  var removeItems = this.getItems( elems );

  this._itemsOn( removeItems, 'remove', function() {
    this.emitEvent( 'removeComplete', [ this, removeItems ] );
  });

  for ( var i=0, len = removeItems.length; i < len; i++ ) {
    var item = removeItems[i];
    item.remove();
    // remove item from collection
    var index = indexOf( this.items, item );
    this.items.splice( index, 1 );
  }
};

/**
 * keep item in collection, but do not lay it out
 * @param {Element} elem
 */
Packery.prototype.ignore = function( elem ) {
  var item = this.getItem( elem );
  if ( item ) {
    item.isIgnored = true;
  }
};

/**
 * return item to layout collection
 * @param {Element} elem
 */
Packery.prototype.unignore = function( elem ) {
  var item = this.getItem( elem );
  if ( item ) {
    delete item.isIgnored;
  }
};

Packery.prototype.sortItemsByPosition = function() {
  // console.log('sortItemsByPosition');
  this.items.sort( function( a, b ) {
    return a.position.y - b.position.y || a.position.x - b.position.x;
  });
};

/**
 * Fit item element in its current position
 * Packery will position elements around it
 * useful for expanding elements
 *
 * @param {Element} elem
 * @param {Number} x - horizontal destination position, optional
 * @param {Number} y - vertical destination position, optional
 */
Packery.prototype.fit = function( elem, x, y ) {
  var item = this.getItem( elem );
  if ( !item ) {
    return;
  }

  // prepare internal properties
  this._getMeasurements();

  // stamp item to get it out of layout
  this.stamp( item.element );
  // required for positionPlaceRect
  item.getSize();
  // set placing flag
  item.isPlacing = true;
  // fall back to current position for fitting
  x = x === undefined ? item.rect.x: x;
  y = y === undefined ? item.rect.y: y;

  // position it best at its destination
  item.positionPlaceRect( x, y, true );

  // emit event when item is fit and other items are laid out
  var _this = this;
  var ticks = 0;
  function tick() {
    ticks++;
    if ( ticks !== 2 ) {
      return;
    }
    _this.emitEvent( 'fitComplete', [ _this, item ] );
  }
  item.on( 'layout', function() {
    tick();
    return true;
  });
  this.on( 'layoutComplete', function() {
    tick();
    return true;
  });
  item.moveTo( item.placeRect.x, item.placeRect.y );
  // layout everything else
  this.layout();

  // return back to regularly scheduled programming
  this.unstamp( item.element );
  this.sortItemsByPosition();
  // un set placing flag, back to normal
  item.isPlacing = false;
  // copy place rect position
  item.copyPlaceRectPosition();
};

// -------------------------- drag -------------------------- //

/**
 * handle an item drag start event
 * @param {Element} elem
 */
Packery.prototype.itemDragStart = function( elem ) {
  this.stamp( elem );
  var item = this.getItem( elem );
  if ( item ) {
    item.dragStart();
  }
};

/**
 * handle an item drag move event
 * @param {Element} elem
 * @param {Number} x - horizontal change in position
 * @param {Number} y - vertical change in position
 */
Packery.prototype.itemDragMove = function( elem, x, y ) {
  var item = this.getItem( elem );
  if ( item ) {
    item.dragMove( x, y );
  }

  // debounce
  var _this = this;
  // debounce triggering layout
  function delayed() {
    _this.layout();
    delete _this.dragTimeout;
  }

  this.clearDragTimeout();

  this.dragTimeout = setTimeout( delayed, 40 );
};

Packery.prototype.clearDragTimeout = function() {
  if ( this.dragTimeout ) {
    clearTimeout( this.dragTimeout );
  }
};

/**
 * handle an item drag end event
 * @param {Element} elem
 */
Packery.prototype.itemDragEnd = function( elem ) {
  var item = this.getItem( elem );
  var itemDidDrag;
  if ( item ) {
    itemDidDrag = item.didDrag;
    item.dragStop();
  }
  // if elem didn't move, or if it doesn't need positioning
  // unignore and unstamp and call it a day
  if ( !item || ( !itemDidDrag && !item.needsPositioning ) ) {
    this.unstamp( elem );
    return;
  }
  // procced with dragged item

  classie.add( item.element, 'is-positioning-post-drag' );

  // save this var, as it could get reset in dragStart
  var itemNeedsPositioning = item.needsPositioning;
  var asyncCount = itemNeedsPositioning ? 2 : 1;
  var completeCount = 0;
  var _this = this;
  function onLayoutComplete() {
    completeCount++;
    // don't proceed if not complete
    if ( completeCount !== asyncCount ) {
      return true;
    }
    // reset item
    if ( item ) {
      classie.remove( item.element, 'is-positioning-post-drag' );
      item.isPlacing = false;
      item.copyPlaceRectPosition();
    }

    _this.unstamp( elem );
    // only sort when item moved
    _this.sortItemsByPosition();

    // emit item drag event now that everything is done
    if ( item && itemNeedsPositioning ) {
      _this.emitEvent( 'dragItemPositioned', [ _this, item ] );
    }
    // listen once
    return true;
  }

  if ( itemNeedsPositioning ) {
    item.on( 'layout', onLayoutComplete );
    item.moveTo( item.placeRect.x, item.placeRect.y );
  } else if ( item ) {
    // item didn't need placement
    item.copyPlaceRectPosition();
  }

  this.clearDragTimeout();
  this.on( 'layoutComplete', onLayoutComplete );
  this.layout();

};

/**
 * binds Draggabilly events
 * @param {Draggabilly} draggie
 */
Packery.prototype.bindDraggabillyEvents = function( draggie ) {
  draggie.on( 'dragStart', this.handleDraggabilly.dragStart );
  draggie.on( 'dragMove', this.handleDraggabilly.dragMove );
  draggie.on( 'dragEnd', this.handleDraggabilly.dragEnd );
};

/**
 * binds jQuery UI Draggable events
 * @param {jQuery} $elems
 */
Packery.prototype.bindUIDraggableEvents = function( $elems ) {
  $elems
    .on( 'dragstart', this.handleUIDraggable.start )
    .on( 'drag', this.handleUIDraggable.drag )
    .on( 'dragstop', this.handleUIDraggable.stop );
};

// ----- destroy ----- //

// remove and disable Packery instance
Packery.prototype.destroy = function() {
  // reset element styles
  this.element.style.position = '';
  this.element.style.height = '';
  delete this.element.packeryGUID;

  // destroy items
  for ( var i=0, len = this.items.length; i < len; i++ ) {
    var item = this.items[i];
    item.destroy();
  }

  this.unbindResize();
};

// -------------------------- data -------------------------- //

/**
 * get Packery instance from element
 * @param {Element} elem
 * @returns {Packery}
 */
Packery.data = function( elem ) {
  var id = elem.packeryGUID;
  return id && packeries[ id ];
};

// -------------------------- declarative -------------------------- //

/**
 * allow user to initialize Packery via .js-packery class
 * options are parsed from data-packery-option attribute
 */
docReady( function() {
  var elems = document.querySelectorAll('.js-packery');

  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    var attr = elem.getAttribute('data-packery-options');
    var options;
    try {
      options = attr && JSON.parse( attr );
    } catch ( error ) {
      // log error, do not initialize
      if ( console ) {
        console.error( 'Error parsing data-packery-options on ' +
          elem.nodeName.toLowerCase() + ( elem.id ? '#' + elem.id : '' ) + ': ' +
          error );
      }
      continue;
    }
    // initialize
    var pckry = new Packery( elem, options );
    // make available via $().data('packery')
    if ( jQuery ) {
      jQuery.data( elem, 'packery', pckry );
    }
  }
});

// -------------------------- jQuery bridge -------------------------- //

// make into jQuery plugin
if ( jQuery && jQuery.bridget ) {
  jQuery.bridget( 'packery', Packery );
}

// -------------------------- transport -------------------------- //

// back in global
Packery.Rect = Rect;
Packery.Packer = Packer;
Packery.Item = Item;
window.Packery = Packery;

})( window );
