

var w = 400;
var h = 600;

window.onload = function() {
  var canvas = document.getElementsByTagName('canvas')[0];

  canvas.width = w;
  canvas.height = h;

};

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

Rect.prototype.contains = function( otherRect ) {
  return this.x <= otherRect.x &&
    this.y <= otherRect.y &&
    this.x + this.width >= otherRect.x + otherRect.width &&
    this.y + this.height >= otherRect.y + otherRect.height;
};

//

var r1 = new Rect({
  x: 10,
  y: 20,
  width: 400,
  height: 600
});

var r2 = new Rect({
  x: 20,
  y: 30,
  width: 40,
  height: 600
});

console.log( r1.contains( r2 ) );
