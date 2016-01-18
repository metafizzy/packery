QUnit.test( '.fit()', function( assert ) {
  var container = document.querySelector('#fitting');
  var pckry = new Packery( container, {
    transitionDuration: '0.2s'
  });

  var done = assert.async();

  var elem1 = container.querySelector('.i1');
  var elem2 = container.querySelector('.i2');
  var elem3 = container.querySelector('.i3');
  var elem5 = container.querySelector('.i5');
  var elem6 = container.querySelector('.i6');
  var item3 = pckry.getItem( elem3 );

  function checkItemPosition( itemElem, x, y, message ) {
    var actual = itemElem.style.left + ' ' + itemElem.style.top;
    var expected = x + 'px ' + y + 'px';
    message = message || 'item position';
    assert.equal( actual, expected, message );
  }

  // expand item3
  elem3.style.width = '48px';
  elem3.style.height = '28px';
  elem3.style.background = 'blue';

  // quickie async
  var isFit, isLaidOut;
  function resetAsync() {
    isFit = false;
    isLaidOut = false;
  }

  // -------------------------- fit -------------------------- //

  function ready1() {
    if ( !isFit || !isLaidOut ) {
      return;
    }
    checkItemPosition( elem1, 20, 30, 'elem1 shifted down' );
    checkItemPosition( elem2, 40, 30, 'elem2 shifted down' );
    checkItemPosition( elem5, 20, 50, 'elem5 shifted down, 2nd row' );
    resetAsync();
    // HACK setTimeout for Packery bug
    setTimeout( fit2 );
  }

  pckry.once( 'fitComplete', function( item ) {
    assert.ok( true, 'fitComplete event emitted' );
    assert.equal( item, item3, 'item argument returned' );
    checkItemPosition( elem3, 20, 0, 'fit elem3 shifted into 2nd spot' );
    isFit = true;
    ready1();
  });

  pckry.once( 'layoutComplete', function() {
    assert.ok( true, 'layoutComplete event emitted' );
    isLaidOut = true;
    ready1();
  });

  // fit it
  pckry.fit( elem3 );

  // -------------------------- fit into spot -------------------------- //

  function ready2() {
    if ( !isFit || !isLaidOut ) {
      return;
    }
    resetAsync();

    setTimeout( fit3 );
  }

  function fit2() {
    // reset small size
    elem3.style.width = '18px';
    elem3.style.height = '18px';

    pckry.once( 'fitComplete', function() {
      assert.ok( true, 'fitComplete event emitted' );
      checkItemPosition( elem3, 40, 20, 'fit item in 40, 20' );
      isFit = true;
      ready2();
    });

    pckry.once( 'layoutComplete', function() {
      assert.ok( true, 'layoutComplete event emitted' );
      checkItemPosition( elem3, 40, 20, 'fit item in 40, 20' );
      checkItemPosition( elem1, 20, 0, 'elem1 shifted up' );
      checkItemPosition( elem2, 40, 0, 'elem2 shifted up' );
      checkItemPosition( elem5, 20, 20, 'elem5 shifted up' );
      checkItemPosition( elem6, 40, 40, 'elem6 shifted down' );
      isLaidOut = true;
      ready2();
    });

    // fit to spot
    pckry.fit( elem3, 40, 20 );
  }

  // -------------------------- fit outside container -------------------------- //

  function ready3() {
    if ( !isFit || !isLaidOut ) {
      return;
    }
    resetAsync();

    setTimeout( fit4 );
  }

  function fit3() {
    pckry.once( 'fitComplete', function() {
      checkItemPosition( elem3, 40, 40, 'fit elem in 3rd row, 3rd column' );
      isFit = true;
      ready3();
    });
    pckry.once( 'layoutComplete', function() {
      isLaidOut = true;
      ready3();
    });

    // try to position item outside container
    pckry.fit( elem3, 120, 120 );
  }

  // -------------------------- columnWidth & rowHeight -------------------------- //

  // fit with columnWidth and rowHeight
  function fit4() {
    pckry.options.columnWidth = 25;
    pckry.options.rowHeight = 30;
    // disable transition, trigger layout, re-enable transition
    pckry.options.transitionDuration = 0;
    pckry.layout();
    pckry.options.transitionDuration = '0.2s';

    function ready4() {
      if ( !isFit || !isLaidOut ) {
        return;
      }
      done();
    }

    pckry.on( 'fitComplete', function() {
      assert.ok( true, 'fitComplete event emitted' );
      checkItemPosition( elem3, 50, 30, 'fit item, 2nd row, 3rd column' );
      isFit = true;
      ready4();
    });

    pckry.on( 'layoutComplete', function() {
      checkItemPosition( elem5, 50, 60, 'elem5 shifted down' );
      isLaidOut = true;
      ready4();
    });

    pckry.fit( elem3, 55, 28 );
  }

});
