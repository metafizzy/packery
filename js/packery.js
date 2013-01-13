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

function Packery( element, options ) {
  this.packer = new Packer();
  // collection of item elements
  this.items = [];
}



Packery.defaults = {
};

Packery.prototype._create = function() {

};

Packery.prototype.getSize = function() {

};

// ----- init ----- //

Packery.prototype._init = function() {
};

Packery.prototype.layout = function() {
  this.packer.reset();
  this.layoutItems( this.items );
};

Packery.prototype.layoutItems = function( items ) {
  for ( var i=0, len = items.length; i < len; i++ ) {
    var item = items[i];
    this._layoutElement( item );
  }
};

Packery.prototype._layoutItem = function( item ) {
  var size = getSize( item );
  var rect = new Rect({
    width: size.outerWidth,
    height: size.outerHeight
  });
  // pack the rect in the packer
  this.packer.pack( rect );
  // copy over position of packed rect to item element
  item.style.left = rect.x + 'px';
  item.style.top  = rect.y + 'px';

};

// -----  ----- //

// back in global
Packery.Rect = Rect;
Packery.Packer = Packer;
window.Packery = Packery;

})( window );
