( function() {

'use strict';

test( 'initLayout', function() {
  var container = document.querySelector('#is-init-layout');
  var pckry = new Packery( container, {
    initLayout: false
  });
  ok( !pckry._isLayoutInited, 'packy is not layout initialized' );
  equal( container.children[0].style.left, '', 'no style on first child' );
});

})();
