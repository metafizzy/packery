QUnit.test( 'consecutive', function( assert ) {
  var container = document.querySelector('#consecutive');
  var pckry = new Packery( container );

  var i0 = container.querySelector('.i0');
  var i1 = container.querySelector('.i1');
  var i3 = container.querySelector('.i3');
  i1.style.width = '28px';
  i1.style.height = '28px';
  i1.style.background = 'blue';

  var done = assert.async();

  pckry.once( 'layoutComplete', function() {
    assert.ok( true, 'layoutComplete triggered' );
    assert.equal( i3.style.left, '0px', 'i3.style.left' );
    assert.equal( i3.style.top, '20px', 'i3.style.top' );
    setTimeout( fit1 );
  });

  pckry.layout();

  function fit1() {
    pckry.once( 'layoutComplete', function() {
      assert.equal( i3.style.left, '60px', 'i3.style.left' );
      assert.equal( i3.style.top, '30px', 'i3.style.top' );
      // all done
      done();
    });
    i0.style.width = '38px';
    i0.style.height = '38px';
    i0.style.background = 'orange';
    pckry.layout();
  }

});
