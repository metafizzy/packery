QUnit.test( 'jQuery plugin', function( assert ) {
  var $ = window.jQuery;
  var done = assert.async();
  var $elem = $('#jquery');

  assert.ok( $.fn.packery, '.packery is in jQuery.fn namespace' );
  assert.equal( typeof $elem.packery, 'function', '.packery is a plugin' );
  $elem.packery();
  var pckry = $elem.data('packery');
  assert.ok( pckry, 'packery instance via .data()' );
  assert.equal( pckry, Packery.data( $elem[0] ), 'instance matches the same one via Packery.data()' );

  var item4 = $elem.children()[4];
  assert.equal( item4.style.left, '0px', '5th item left' );
  assert.equal( item4.style.top, '40px', '5th item top' );

  $elem.children().first().css({
    width: 48,
    height: 8,
    background: 'blue'
  });

  $elem.packery( 'on', 'layoutComplete', function() {
    assert.ok( true, 'layoutComplete event emitted' );
    assert.equal( item4.style.left, '20px', '4th item left after layout' );
    assert.equal( item4.style.top, '30px', '4th item top after layout' );
    done();
  });

  $elem.packery();
});
