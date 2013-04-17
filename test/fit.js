( function() {

'use strict';

var after = window.after;

test( '.fit()', function() {
  var container = document.querySelector('#fitting');
  var pckry = new Packery( container );

  var elem1 = container.querySelector('.i1');
  var elem2 = container.querySelector('.i2');
  var elem3 = container.querySelector('.i3');
  var item3 = pckry.getItem( elem3 );
  // expand item3
  elem3.style.width = '48px';
  elem3.style.height = '28px';
  elem3.style.background = 'blue';

  // quickie async
  var isFit = false;
  var isLaidOut = false;
  function ready1() {
    if ( !isFit || !isLaidOut ) {
      return;
    }
    equal( elem1.style.left, '0px', 'elem1.style.left = 0' );
    equal( elem1.style.top, '20px', 'elem1.style.top = 20px' );
    equal( elem2.style.left, '20px', 'elem2.style.left = 20px' );
    equal( elem2.style.top, '30px', 'elem2.style.top = 30px' );
    isFit = false;
    isLaidOut = false;
    // trigger next thing
    after( then1, fit2 );
  }

  pckry.on( 'fitComplete', function( pckryInstance, item ) {
    ok( true, 'fitComplete event emitted' );
    equal( pckryInstance, pckry, 'packery instance returned' );
    equal( item, item3, 'item argument returned' );
    equal( elem3.style.left, '30px', 'elem3.style.left = 30px' );
    isFit = true;
    ready1();
    return true;
  });

  pckry.on( 'layoutComplete', function() {
    ok( true, 'layoutComplete event emitted' );
    isLaidOut = true;
    ready1();
    return true;
  });

  // fit it
  stop();
  pckry.fit( elem3 );
  var then1 = true;

  function ready2() {
    if ( !isFit || !isLaidOut ) {
      return;
    }
    isFit = false;
    isLaidOut = false;
    // trigger next thing
    after( then2, fit3 );
  }

  var then2;
  function fit2() {
    elem3.style.width = '18px';
    elem3.style.height = '18px';

    pckry.on( 'fitComplete', function() {
      ok( true, 'fitComplete event emitted' );
      equal( elem3.style.left, '40px', 'elem3.style.left = 40px' );
      equal( elem3.style.top, '20px', 'elem3.style.top = 20px' );
      isFit = true;
      ready2();
      return true;
    });

    pckry.on( 'layoutComplete', function() {
      ok( true, 'layoutComplete event emitted' );
      isLaidOut = true;
      ready2();
      return true;
    });

    pckry.fit( elem3, 40, 20 );
    then2 = true;
  }

  function ready3() {
    if ( !isFit || !isLaidOut ) {
      return;
    }
    isFit = false;
    isLaidOut = false;
    // trigger next thing
    after( then3, fit4 );
    // fit4();
  }

  var then3;
  function fit3() {
    pckry.on( 'fitComplete', function() {

      equal( elem3.style.left, '60px', 'x value limited' );
      equal( elem3.style.top, '120px', 'y value NOT limited' );
      isFit = true;
      ready3();
      return true;
    });
    pckry.on( 'layoutComplete', function() {
      isLaidOut = true;
      ready3();
      return true;
    });
    // try to position item outside container
    pckry.fit( elem3, 120, 120 );
    then3 = true;
  }

  // fit with columnWidth and rowHeight
  function fit4() {
    pckry.options.columnWidth = 30;
    pckry.options.rowHeight = 30;

    pckry.on( 'fitComplete', function() {
      ok( true, 'fitComplete event emitted' );
      equal( elem3.style.left, '30px', 'with columnWidth, elem3.style.left = 30px' );
      equal( elem3.style.top, '120px', 'with rowHeight, elem3.style.top = 120px' );
      start();
    });

    pckry.fit( elem3 );
  }

});


})();

