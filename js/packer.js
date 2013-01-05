( function( window ) {

'use strict';

var Rect = window.Rect2D;
var w = 400;
var h = 600;
var ctx;
// var myPacker = new Packer( w, Number.POSITIVE_INFINITY );
var myPacker = new Packer( w, h );

window.onload = function() {
  var canvas = document.getElementsByTagName('canvas')[0];
  canvas.width = w;
  canvas.height = h;

  ctx = canvas.getContext('2d');

};

var rects = [];

window.pack = function() {
  var hue = Math.floor( Math.random() * 360 );
  var lum = Math.floor( Math.random() * 25 + 25 );

  var rect = new Rect({
    width:  ( Math.floor( Math.random() * 4 ) + 1 ) * 20,
    height: ( Math.floor( Math.random() * 4 ) + 1 ) * 20
    // width:  ( Math.floor( Math.random() * 50 ) + 10 ),
    // height: ( Math.floor( Math.random() * 50 ) + 10 )
    // width:  100,
    // height: 100
  });

  rects.push( rect );

  rect.color = 'hsla( ' + hue + ', 100%, ' + lum + '%, 0.5)';

  myPacker.pack( rect );
  render();
  // renderRect( rect );
};

function render() {
  ctx.clearRect( 0, 0, w, h );

  rects.forEach( renderRect );

  // myPacker.spaces.forEach( renderRect );
}

function renderRect( rect ) {
  // console.log( rect.color || 'hsla( 0, 0%, 0%, 0.2)' );
  ctx.fillStyle = rect.color || 'hsla( 0, 0%, 0%, 0.05)';
  ctx.fillRect( rect.x, rect.y, rect.width, rect.height );
  ctx.strokeStyle = rect.color ? '#666' : '#AAA';
  ctx.strokeRect( rect.x + 0.5, rect.y + 0.5, rect.width, rect.height );
}


// -------------------------- Packer -------------------------- //

function Packer( width, height ) {
  this.width = width;
  this.height = height;

  this.spaces = [];
  this.newSpaces = [];

  var initialSpace = new Rect({
    x: 0,
    y: 0,
    width: this.width,
    height: this.height
  });

  this.spaces.push( initialSpace );
}

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
  rect.x = space.x;
  rect.y = space.y;

  // update spaces
  var revisedSpaces = [];
  this.spaces.forEach( function( iSpace, i ) {
    var newSpaces = iSpace.getMaximalFreeRects( rect );
    // if it didn't overlap, or if it did and there are new spaces
    if ( !newSpaces || newSpaces.length ) {
      revisedSpaces = revisedSpaces.concat( newSpaces || iSpace );
    }
    // otherwise, rect took up entire space
  });

  this.spaces = revisedSpaces;
  // remove redundant spaces
  Rect.mergeRects( this.spaces );
  console.log( this.spaces );

  this.spaces.sort( Packer.spaceSorterTopLeft );
};

Packer.spaceSorterTopLeft = function( a, b ) {
  return a.y - b.y || a.x - b.x;
};

Packer.spaceSorterLeftTop = function( a, b ) {
  return a.x - b.x || a.y - b.y;
};

})( window );
