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
  var lum = Math.floor( Math.random() * 50 + 25 );

  var rect = new Rect({
    width: ( Math.floor( Math.random() * 4 ) + 1 ) * 20,
    height: ( Math.floor( Math.random() * 4 ) + 1 ) * 20
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

  myPacker.spaces.forEach( renderRect );
  myPacker.newSpaces.forEach( renderRect );
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
      // remove space from collection
      this.spaces.splice( i, 1 );
      this.placeInSpace( rect, space );
      break;
    }
  }
};

Packer.prototype.placeInSpace = function( rect, space ) {
  // place rect in space
  rect.x = space.x;
  rect.y = space.y;

  this.spaces.forEach( function( aSpace ) {
    space.color = 'hsla(0, 0%, 0%, 0.05)';
  });


  // get new spaces, areas around rect in space

  var allNewSpaces = [];
  var newSpaces = space.getMaximalFreeRects( rect );
  allNewSpaces = allNewSpaces.concat( newSpaces );
  // do the same for other spaces
  this.spaces.forEach( function( aSpace ) {
    newSpaces = aSpace.getMaximalFreeRects( rect );
    console.log( newSpaces );
    if ( newSpaces && newSpaces.length ) {
      allNewSpaces = allNewSpaces.concat( newSpaces );
    }
  });

  this.spaces = allNewSpaces;
  // var newSpaces = space.getMaximalFreeRects( rect );
  // this.newSpaces = newSpaces;
  // this.newSpaces.forEach( function( aSpace ) {
  //   space.color = 'hsla(0, 100%, 50%, 0.3)';
  // });
  // console.log( 'new spaces', newSpaces );
  // // add to spaces collection
  // this.spaces = this.spaces.concat( newSpaces );
  // console.log( this.spaces.length );
  // remove redundant spaces
  Rect.mergeRects( this.spaces );
  console.log( this.spaces );
};

})( window );
