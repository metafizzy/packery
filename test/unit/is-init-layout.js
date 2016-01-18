QUnit.test( 'initLayout', function( assert ) {
  var container = document.querySelector('#is-init-layout');
  var pckry = new Packery( container, {
    initLayout: false
  });
  assert.ok( !pckry._isLayoutInited, 'packy is not layout initialized' );
  assert.equal( container.children[0].style.left, '', 'no style on first child' );
});
