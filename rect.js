( function( window ) {

"use strict";

// -------------------------- Rect -------------------------- //

function Rect( props ) {
  // extend properties from defaults
  for ( var prop in Rect.defaults ) {
    this[ prop ] = Rect.defaults[ prop ];
  }

  for ( prop in props ) {
    if ( Rect.defaults.hasOwnProperty( prop ) ) {
      this[ prop ] = props[ prop ];
    }
  }

}

Rect.defaults = {
  x: 0,
  y: 0,
  width: 0,
  height: 0
};

/**
 * Determines whether or not this rectangle wholly encloses another rectangle or point.
 * @param {Rect} otherRect
 * @returns {Boolean}
**/
Rect.prototype.contains = function( otherRect ) {
  // points don't have width or height
  var otherWidth = otherRect.width || 0;
  var otherHeight = otherRect.height || 0;
  return this.x <= otherRect.x &&
    this.y <= otherRect.y &&
    this.x + this.width >= otherRect.x + otherWidth &&
    this.y + this.height >= otherRect.y + otherHeight;
};

/**
 * Determines whether or not the rectangle intersects with another.
 * @param {Rect} rect
 * @returns {Boolean}
**/
Rect.prototype.overlaps = function( rect ) {
  var thisRight = this.x + this.width;
  var thisBottom = this.y + this.height;
  var rectRight = rect.x + rect.width;
  var rectBottom = rect.y + rect.height;

  // http://stackoverflow.com/a/306332
  return this.x < rectRight &&
    thisRight > rect.x &&
    this.y < rectBottom &&
    thisBottom > rect.y;
};

Rect.prototype.getMaximalFreeRects = function( otherRect ) {
  var freeRects = [];

  // if no intersection, return empty array
  if ( !this.overlaps( otherRect ) ) {
    return freeRects;
  }

  var freeRect;

  var thisRight = this.x + this.width;
  var thisBottom = this.y + this.height;
  var otherRight = otherRect.x + otherRect.width;
  var otherBottom = otherRect.y + otherRect.height;

  // top
  if ( this.y < otherRect.y ) {
    freeRect = new Rect({
      x: this.x,
      y: this.y,
      width: this.width,
      height: otherRect.y - this.y
    });
    freeRects.push( freeRect );
  }

  // right
  if ( thisRight > otherRight ) {
    freeRect = new Rect({
      x: otherRight,
      y: this.y,
      width: thisRight - otherRight,
      height: this.height
    });
    freeRects.push( freeRect );
  }

  // bottom
  if ( thisBottom > otherBottom ) {
    freeRect = new Rect({
      x: this.x,
      y: otherBottom,
      width: this.width,
      height: thisBottom - otherBottom
    });
    freeRects.push( freeRect );
  }

  // left
  if ( this.x < otherRect.x ) {
    freeRect = new Rect({
      x: this.x,
      y: this.y,
      width: otherRect.x - this.x,
      height: this.height
    });
    freeRects.push( freeRect );
  }

  return freeRects;
};

Rect.prototype.canFit = function( rect ) {
  return this.width >= rect.width && this.height >= rect.height;
};

// -------------------------- utility methods -------------------------- //

/**
 * Remove redundant rectangle from array of rectangles
 * @param {Array} rects: an array of Rects
 * @returns {Array} rects: an array of Rects
**/
Rect.mergeRects = function( rects ) {
  rects.forEach( function( rect, i ) {
    // clone rects we're testing, remove this rect
    var compareRects = rects.slice(0);
    // do not compare with self
    compareRects.splice( i, 1 );
    // compare this rect with others
    var removedCount = 0;
    compareRects.forEach( function( compareRect, j ) {
      // if this rect contains another,
      // remove that rect from test collection
      var indexAdjust = i > j ? 0 : 1;
      if ( rect.contains( compareRect ) ) {
        // console.log( 'current test rects:' + testRects.length, testRects );
        // console.log( i, j, indexAdjust, rect, compareRect );
        rects.splice( j + indexAdjust - removedCount, 1 );
        removedCount++;
      }
    });
  });

  return rects;
};

// --------------------------  -------------------------- //

window.Rect2D = Rect;

})( window );
