( function() {

'use strict';

test( 'consecutive', function() {
  var container = document.querySelector('#consecutive');
  var pckry = new Packery( container );

  var i0 = container.querySelector('.i0');
  var i1 = container.querySelector('.i1');
  var i3 = container.querySelector('.i3');
  i1.style.width = '28px';
  i1.style.height = '28px';
  i1.style.background = 'blue';

  pckry.on( 'layoutComplete', function() {
    ok( true, 'layoutComplete triggered' );
    equal( i3.style.left, '0px', 'i3.style.left' );
    equal( i3.style.top, '20px', 'i3.style.top' );
    after( then, fit1 );
    return true;
  });

  stop();
  pckry.layout();
  var then = true;

  function fit1() {
    pckry.on( 'layoutComplete', function() {
      equal( i3.style.left, '60px', 'i3.style.left' );
      equal( i3.style.top, '30px', 'i3.style.top' );
      // all done
      start();
      return true;
    });
    i0.style.width = '38px';
    i0.style.height = '38px';
    i0.style.background = 'orange';
    pckry.layout();
    return true;
  }

});

})();
