/**
 * Packery v0.0.1
 * Bin-packing layout
 * by David DeSandro / Metafizzy
 */

( function( window ) {

'use strict';

var document = window.document;
var _Packery = window.Packery;
var Rect = _Packery.Rect;
var Packer = _Packery.Packer;
var getSize = window.getSize;

// dependencies
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
  isResizable: true
};

Packery.prototype._create = function() {
  this.reloadItems();

  var containerStyle = this.options.containerStyle;
  for ( var prop in containerStyle ) {
    this.element.style[ prop ] = containerStyle[ prop ];
  }

  var _this = this;

  // bind resize method
  if ( this.options.isResizable ) {
    addEvent( window, 'resize', function(){
      _this._handleResize();
    });
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

  var items = [];
  var itemSelector = this.options.itemSelector;

  if ( itemSelector ) {
    // filter & find items if we have an item selector
    for ( var j=0, jLen = potentials.length; j < jLen; j++ ) {
      var potential = potentials[j];
      // filter
      if ( matchesSelector( potential, itemSelector ) ) {
        items.push( potential );
      }
      // find
      var recentlyFound = potential.querySelectorAll( itemSelector );
      // concat recentlyFound to filterFound array
      for ( var k=0, kLen = recentlyFound.length; k < kLen; k++ ) {
        items.push( recentlyFound[k] );
      }
    }
  } else {
    items = potentials;
  }

  // style items
  for ( var l=0, lLen = items.length; l < lLen; l++ ) {
    var item = items[l];
    item.style.position = 'absolute';
  }

  return items;

},

Packery.prototype.getSize = function() {

};

// ----- init ----- //

Packery.prototype._init = function() {
  // reset packer
  var elemSize = getSize( this.element );
  this.packer.width = elemSize.innerWidth;
  this.packer.height = Number.POSITIVE_INFINITY;
  this.packer.reset();

  // layout
  this.maxY = 0;
  this.layoutItems( this.items );
};

/**
 * layout a collection of item elements
 * @param {Array} items - array of elements
 */
Packery.prototype.layoutItems = function( items ) {
  for ( var i=0, len = items.length; i < len; i++ ) {
    // console.log( i );
    var item = items[i];
    this._layoutItem( item );
  }

  // set container size
  this.element.style.height = this.maxY + 'px';
};

/**
 * layout item element in container
 * @param {Element} item
 */
Packery.prototype._layoutItem = function( item ) {
  // console.log( item );
  var size = getSize( item );
  var w = size.outerWidth;
  var h = size.outerHeight;
  // size for columnWidth and rowHeight, if available
  var colW = this.options.columnWidth;
  w = colW ? Math.ceil( w / colW ) * colW : w;
  var rowH = this.options.rowHeight;
  h = rowH ? Math.ceil( h / rowH ) * rowH : h;

  var rect = new Rect({
    width: w,
    height: h
  });
  // pack the rect in the packer
  this.packer.pack( rect );
  // copy over position of packed rect to item element
  item.style.left = rect.x + 'px';
  item.style.top  = rect.y + 'px';
  // console.log( size, rect.x, rect.y );

  this.maxY = Math.max( rect.y + rect.height, this.maxY );
};

// -------------------------- resize -------------------------- //

// original debounce by John Hann
// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/

// this fires every resize
Packery.prototype._handleResize = function() {
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
  this.layoutItems( items );
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
  var index = this.items.indexOf( elem );
  if ( index === -1 ) {
    return;
  }
  // remove item from collection
  this.items.splice( index, 1 );
  // remove item element from DOM
  elem.parentNode.removeChild( elem );
};

// -----  ----- //

// back in global
Packery.Rect = Rect;
Packery.Packer = Packer;
window.Packery = Packery;

})( window );
