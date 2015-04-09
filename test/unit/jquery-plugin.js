( function() {

'use strict';

var $ = window.jQuery;


test( 'jQuery plugin', function() {
  var $elem = $('#jquery');
  ok( $.fn.packery, '.packery is in jQuery.fn namespace' );
  equal( typeof $elem.packery, 'function', '.packery is a plugin' );
  $elem.packery();
  var pckry = $elem.data('packery');
  ok( pckry, 'packery instance via .data()' );
  equal( pckry, Packery.data( $elem[0] ), 'instance matches the same one via Packery.data()' );

  var item4 = $elem.children()[4];
  equal( item4.style.left, '0px', '5th item left' );
  equal( item4.style.top, '40px', '5th item top' );

  $elem.children().first().css({
    width: 48,
    height: 8,
    background: 'blue'
  });

  $elem.packery( 'on', 'layoutComplete', function() {
    ok( true, 'layoutComplete event emitted' );
    equal( item4.style.left, '20px', '4th item left after layout' );
    equal( item4.style.top, '30px', '4th item top after layout' );
    start();
  });

  stop();
  $elem.packery();
});

})();