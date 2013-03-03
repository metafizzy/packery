/**
 * Packery v0.0.1
 * Bin-packing layout
 * by David DeSandro / Metafizzy
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
var docListener = window.docListener;
var EventEmitter = window.EventEmitter;
var eventie = window.eventie;
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
function isElement(o){
  return (
    typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
    o && typeof o === "object" && o.nodeType === 1 && typeof o.nodeName==="string"
  );
}

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
    console.error( element + ' Packery element' );
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
  this.layout();
}

// inherit EventEmitter
extend( Packery.prototype, EventEmitter.prototype );

// default options
Packery.prototype.options = {
  containerStyle: {
    position: 'relative'
  },
  isResizable: true,
  transitionDuration: '0.4s'
};

Packery.prototype._create = function() {
  // initial properties
  this.packer = new Packer();
  // get items from children
  this.reloadItems();
  // collection of element that don't get laid out
  this.placedElements = [];
  this.place( this.options.placedElements );

  var containerStyle = this.options.containerStyle;
  extend( this.element.style, containerStyle );

  // bind resize method
  if ( this.options.isResizable ) {
    eventie.bind( window, 'resize', this );
  }

  // create drag handlers
  var _this = this;
  this.handleDraggabilly = {
    start: function handleDraggabillyStart( event, pointer, draggie ) {
      _this.itemDragStart( draggie.element );
    },
    drag: function handleDraggabillyDrag( event, pointer, draggie ) {
      _this.itemDragMove( draggie.element, draggie.position.x, draggie.position.y );
    },
    stop: function handleDraggabillyStop( event, pointer, draggie ) {
      _this.itemDragStop( draggie.element );
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
      _this.itemDragStop( event.currentTarget );
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

Packery.prototype.layout = function() {
  // reset packer
  this.elementSize = getSize( this.element );

  this._getMeasurements();

  this.packer.width = this.elementSize.innerWidth + this.gutter;
  this.packer.height = Number.POSITIVE_INFINITY;
  this.packer.reset();


  // layout
  this.maxY = 0;
  this.spacePlacedElements();
  // don't animate first layout
  this.layoutItems( this.items, !this._isInited );

  // flag for initalized
  this._isInited = true;
};

// _init is alias for layout
Packery.prototype._init = Packery.prototype.layout;

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
 * @param {Boolean} isStill - disable transitions for setting item position
 */
Packery.prototype.layoutItems = function( items, isStill ) {
  // console.log('layout Items');
  var layoutItems = this._getLayoutItems( items );

  this._itemsOn( layoutItems, 'layout', function onItemsLayout() {
    this.emitEvent( 'layoutComplete', [ this ] );
  });

  for ( var i=0, len = layoutItems.length; i < len; i++ ) {
    var item = layoutItems[i];
    // listen to layout events for callback
    this._packItem( item );
    this._layoutItem( item, isStill );
  }

  // set container size
  this.element.style.height = this.maxY + 'px';
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
 * @param {Boolean} isStill - disables transitions
 */
Packery.prototype._layoutItem = function( item, isStill ) {

  // copy over position of packed rect to item element
  var rect = item.rect;
  if ( isStill ) {
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

// -------------------------- place -------------------------- //

/**
 * adds elements to placedElements
 * @param {NodeList, Array, Element, or String} elems
 */
Packery.prototype.place = function( elems ) {
  if ( !elems ) {
    return;
  }
  // if string, use argument as selector string
  if ( typeof elems === 'string' ) {
    elems = this.element.querySelectorAll( elems );
  }
  elems = makeArray( elems );
  this.placedElements.push.apply( this.placedElements, elems );
  // ignore
  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    this.ignore( elem );
  }
};

/**
 * removes elements to placedElements
 * @param {NodeList, Array, or Element} elems
 */
Packery.prototype.unplace = function( elems ) {
  if ( !elems ){
    return;
  }
  elems = makeArray( elems );

  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    // filter out removed place elements
    var index = indexOf( this.placedElements, elem );
    if ( index !== -1 ) {
      this.placedElements.splice( index, 1 );
    }
    this.unignore( elem );
  }

};

// make spaces for placed elements
Packery.prototype.spacePlacedElements = function() {
  if ( !this.placedElements || !this.placedElements.length ) {
    return;
  }
  // get bounding rect for container element
  var elementBoundingRect = this.element.getBoundingClientRect();
  this._boundingLeft = elementBoundingRect.left + this.elementSize.paddingLeft;
  this._boundingTop  = elementBoundingRect.top  + this.elementSize.paddingTop;

  for ( var i=0, len = this.placedElements.length; i < len; i++ ) {
    var elem = this.placedElements[i];
    this.spacePlaced( elem );
  }
};

/**
 * makes space for element
 * @param {Element} elem
 */
Packery.prototype.spacePlaced = function( elem ) {
  var item = this.getItemFromElement( elem );
  var rect;
  if ( item && item.dragRect ) {
    rect = item.dragRect;
  } else {
    var boundingRect = elem.getBoundingClientRect();
    rect = new Rect({
      x: boundingRect.left - this._boundingLeft,
      y: boundingRect.top - this._boundingTop
    });
  }

  this._setRectSize( elem, rect );
  // save its space in the packer
  this.packer.placed( rect );
  this._setMaxY( rect );
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
Packery.prototype.resizeHandler = function( event ) {
  if ( event.target !== window ) {
    return;
  }

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
  if ( size.innerWidth === this.elementSize.innerWidth ) {
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
  // layout just the new items
  this.layoutItems( items, true );
  // reveal new items
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
Packery.prototype.getItemFromElement = function( elem ) {
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
Packery.prototype.getItemsFromElements = function( elems ) {
  if ( !elems || !elems.length ) {
    return;
  }
  var items = [];
  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    var item = this.getItemFromElement( elem );
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

  var removeItems = this.getItemsFromElements( elems );

  this._itemsOn( removeItems, 'remove', function() {
    this.emitEvent( 'removeComplete', [ this ] );
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
  var item = this.getItemFromElement( elem );
  if ( item ) {
    item.isIgnored = true;
  }
};

/**
 * return item to layout collection
 * @param {Element} elem
 */
Packery.prototype.unignore = function( elem ) {
  var item = this.getItemFromElement( elem );
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

// -------------------------- drag -------------------------- //

/**
 * handle an item drag start event
 * @param {Element} elem
 */
Packery.prototype.itemDragStart = function( elem ) {
  this.place( elem );
  var item = this.getItemFromElement( elem );
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
  var item = this.getItemFromElement( elem );
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

  if ( this.dragTimeout ) {
    clearTimeout( this.dragTimeout );
  }

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
Packery.prototype.itemDragStop = function( elem ) {
  var item = this.getItemFromElement( elem );
  var dropX, dropY, itemDidDrag;
  if ( item ) {
    // copy over vars, they're reset by dragStop
    dropX = item.dragRect.x;
    dropY = item.dragRect.y;
    itemDidDrag = item.didDrag;
    item.dragStop();
  }
  // if elem didn't move, or if it doesn't need positioning
  // unignore and unplace and call it a day
  if ( !item || ( !itemDidDrag && !item.needsPositioning ) ) {
    this.unplace( elem );
    return;
  }
  // procced with dragged item

  classie.add( item.element, 'is-positioning-post-drag' );

  var asyncCount = item.needsPositioning ? 2 : 1;
  var completeCount = 0;
  var _this = this;
  function onLayoutComplete() {
    completeCount++;
    // don't proceed if not complete
    if ( completeCount !== asyncCount ) {
      return true;
    }

    if ( item ) {
      classie.remove( item.element, 'is-positioning-post-drag' );
      delete item.dragRect;
    }

    _this.unplace( elem );
    // only sort when item moved
    _this.sortItemsByPosition();
    // listen once
    return true;
  }

  if ( item.needsPositioning ) {
    item.on( 'layout', function() {
      _this.emitEvent( 'dragItemPositioned', [ _this, item ] );
      return true;
    });
    item.on( 'layout', onLayoutComplete );
    item.moveTo( dropX, dropY );
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
  draggie.on( 'start', this.handleDraggabilly.start );
  draggie.on( 'drag', this.handleDraggabilly.drag );
  draggie.on( 'stop', this.handleDraggabilly.stop );
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

  eventie.unbind( window, 'resize', this );
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
docListener.on( 'ready', function() {
  var elems = document.querySelectorAll('.js-packery');

  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    var attr = elem.getAttribute('data-packery-options');
    var options;
    try {
      options = attr && JSON.parse( attr );
    } catch ( error ) {
      // log error, but proceed
      console.error( 'Error parsing data-packery-options on ' +
        elem.nodeName.toLowerCase() + ( elem.id ? '#' + elem.id : '' ) + ': ' +
        error );
      continue;
    }
    console.log('new packery from declarative');
    new Packery( elem, options );
  }
});

// -------------------------- transport -------------------------- //

// back in global
Packery.Rect = Rect;
Packery.Packer = Packer;
Packery.Item = Item;
window.Packery = Packery;

})( window );
