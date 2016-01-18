QUnit.test( 'defaults / empty', function( assert ) {
  var empty = document.querySelector('#empty');
  var pckry = new Packery( empty );
  var done = assert.async();

  assert.deepEqual( pckry.options, Packery.defaults, 'default options match prototype' );
  assert.equal( pckry.items.length, 0, 'zero items' );
  assert.equal( pckry.stamps.length, 0, 'zero stamped elements' );
  assert.equal( Packery.data( empty ), pckry, 'data method returns instance' );
  assert.ok( pckry.isResizeBound, 'isResizeBound' );

  pckry.once( 'layoutComplete', function( items ) {
    assert.ok( true, 'layoutComplete triggered with no items' );
    assert.equal( items.length, 0, 'no items' );
    done();
  });

  // add gutter, to check that container size doesn't get negative number
  pckry.options.gutter = 20;
  pckry.layout();
});
