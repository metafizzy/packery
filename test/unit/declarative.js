QUnit.test( 'declarative', function( assert ) {

  var $ = window.jQuery;

  // no data-packery-options
  var container1 = document.querySelector('#declarative');
  var pckry1 = Packery.data( container1 );
  assert.ok( pckry1 instanceof Packery, 'Packery instance retrieved from element' );
  assert.deepEqual( pckry1.options, Packery.defaults, 'options match defaults' );
  assert.ok( pckry1._isLayoutInited, 'Packer was initialized' );

  // has data-packery-options, but bad JSON
  var container2 = document.querySelector('#declarative-bad-json');
  var pckry2 = Packery.data( container2 );
  assert.ok( !pckry2, 'bad JSON in data-packery-options does not init Packery' );
  assert.ok( !container2.packeryGUID, 'no expando property on element' );

  // has good data-packery-options
  var container3 = document.querySelector('#declarative-good-json');
  var pckry3 = Packery.data( container3 );
  assert.ok( pckry3 instanceof Packery, 'Packery instance retrieved from element, with good JSON in data-packery-options' );
  assert.strictEqual( pckry3.options.columnWidth, 25, 'columnWidth option was set' );
  assert.strictEqual( pckry3.options.rowHeight, 30, 'rowHeight option was set' );
  assert.strictEqual( pckry3.options.transitionDuration, '1.2s', 'transitionDuration option was set' );
  assert.strictEqual( pckry3.options.isResizable, false, 'isResizable option was set' );

  assert.equal( $.data( container3, 'packery' ), pckry3, '$.data( elem, "packery") returns Packery instance' );

});
