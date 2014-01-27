/**
 * Packer
 * bin-packing algorithm
 */

( function( window ) {

'use strict';

// -------------------------- Packer -------------------------- //

function packerDefinition( Rect ) {

/**
 * @param {Number} width
 * @param {Number} height
 * @param {String} sortDirection
 *   topLeft for vertical, leftTop for horizontal
 */
function Packer( width, height, sortDirection ) {
  this.width = width || 0;
  this.height = height || 0;
  this.sortDirection = sortDirection || 'downwardLeftToRight';

  this.reset();
}

Packer.prototype.reset = function() {
  this.spaces = [];
  this.newSpaces = [];

  if ( this.center ) {
    var initialSpaces = [
      // top left
      new Rect ({
        x: 0,
        y: 0,
        width: this.center.x,
        height: this.center.y,
        nearestCornerDistance: 0
      }),
      // top right
      new Rect ({
        x: this.center.x,
        y: 0,
        width: this.width - this.center.x,
        height: this.center.y,
        nearestCornerDistance: 0
      }),
      // bottom left
      new Rect ({
        x: 0,
        y: this.center.y,
        width: this.center.x,
        height: this.height - this.center.y,
        nearestCornerDistance: 0
      }),
      // bottom right
      new Rect ({
        x: this.center.x,
        y: this.center.y,
        width: this.width - this.center.x,
        height: this.height - this.center.y,
        nearestCornerDistance: 0
      })
    ];
    this.spaces = this.spaces.concat( initialSpaces );
  } else {
    var initialSpace = new Rect({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height
    });

    this.spaces.push( initialSpace );
  }

  this.sorter = sorters[ this.sortDirection ] || sorters.downwardLeftToRight;

};

// change x and y of rect to fit with in Packer's available spaces
Packer.prototype.pack = function( rect ) {
  for ( var i=0, len = this.spaces.length; i < len; i++ ) {
    var space = this.spaces[i];
    if ( space.canFit( rect ) ) {
      this.placeInSpace( rect, space );
      break;
    }
  }
};

Packer.prototype.placeInSpace = function( rect, space ) {
  // place rect in space
  if ( this.center ) {
    rect.x = space.x >= this.center.x ? space.x : ( space.x + space.width - rect.width );
    rect.y = space.y >= this.center.y ? space.y : ( space.y + space.height - rect.height );
  } else {

    rect.x = space.x;
    rect.y = space.y;
  }

  this.placed( rect );
};

// update spaces with placed rect
Packer.prototype.placed = function( rect ) {
  // update spaces
  var revisedSpaces = [];
  for ( var i=0, len = this.spaces.length; i < len; i++ ) {
    var space = this.spaces[i];
    var newSpaces = space.getMaximalFreeRects( rect );
    // add either the original space or the new spaces to the revised spaces
    if ( newSpaces ) {
      revisedSpaces.push.apply( revisedSpaces, newSpaces );
      this.measureNearestCornerDistance( newSpaces );
    } else {
      revisedSpaces.push( space );
    }
  }

  this.spaces = revisedSpaces;

  // remove redundant spaces
  Packer.mergeRects( this.spaces );

  this.spaces.sort( this.sorter );
};

Packer.prototype.measureNearestCornerDistance = function( spaces ) {
  if ( !this.center ) {
    return;
  }


  for ( var i=0, len = spaces.length; i < len; i++ ) {
    var space = spaces[i];
    var corner = {
      x: space.x >= this.center.x ? space.x : space.x + space.width,
      y: space.y >= this.center.y ? space.y : space.y + space.height
    };
    space.nearestCornerDistance = getDistance( corner, this.center );
  }

};

function getDistance( pointA, pointB ) {
  var dx = pointB.x - pointA.x;
  var dy = pointB.y - pointA.y;
  return Math.sqrt( dx * dx + dy * dy );
}

// -------------------------- utility functions -------------------------- //

/**
 * Remove redundant rectangle from array of rectangles
 * @param {Array} rects: an array of Rects
 * @returns {Array} rects: an array of Rects
**/
Packer.mergeRects = function( rects ) {
  for ( var i=0, len = rects.length; i < len; i++ ) {
    var rect = rects[i];
    // skip over this rect if it was already removed
    if ( !rect ) {
      continue;
    }
    // clone rects we're testing, remove this rect
    var compareRects = rects.slice(0);
    // do not compare with self
    compareRects.splice( i, 1 );
    // compare this rect with others
    var removedCount = 0;
    for ( var j=0, jLen = compareRects.length; j < jLen; j++ ) {
      var compareRect = compareRects[j];
      // if this rect contains another,
      // remove that rect from test collection
      var indexAdjust = i > j ? 0 : 1;
      if ( rect.contains( compareRect ) ) {
        // console.log( 'current test rects:' + testRects.length, testRects );
        // console.log( i, j, indexAdjust, rect, compareRect );
        rects.splice( j + indexAdjust - removedCount, 1 );
        removedCount++;
      }
    }
  }

  return rects;
};


// -------------------------- sorters -------------------------- //

// functions for sorting rects in order
var sorters = {
  // top down, then left to right
  downwardLeftToRight: function( a, b ) {
    return a.y - b.y || a.x - b.x;
  },
  // left to right, then top down
  rightwardTopToBottom: function( a, b ) {
    return a.x - b.x || a.y - b.y;
  },

  centeredOutCorners: function ( a, b ) {
    return a.nearestCornerDistance - b.nearestCornerDistance;
  }
};


// --------------------------  -------------------------- //

return Packer;

}

// -------------------------- transport -------------------------- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( [ './rect' ], packerDefinition );
} else {
  // browser global
  var Packery = window.Packery = window.Packery || {};
  Packery.Packer = packerDefinition( Packery.Rect );
}

})( window );
