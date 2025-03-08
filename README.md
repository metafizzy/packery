# Packery

_Bin-packing layout library_

See [packery.metafizzy.co](https://packery.metafizzy.co) for complete docs and demos

## Install

### Download

+ [packery.pkgd.js](https://unpkg.com/packery@3/dist/packery.pkgd.js) un-minified, or
+ [packery.pkgd.min.js](https://unpkg.com/packery@3/dist/packery.pkgd.min.js) minified

### CDN

Link directly to Packery files on [unpkg](https://unpkg.com).

``` html
<script src="https://unpkg.com/packery@3/dist/packery.pkgd.js"></script>
<!-- or -->
<script src="https://unpkg.com/packery@3/dist/packery.pkgd.min.js"></script>
```

### Package managers

[npm](https://www.npmjs.com/package/packery): `npm install packery --save`

Bower: `bower install packery --save`

## License

Packery v3 is licensed under the MIT license.

## Initialize

With jQuery

``` js
$('.grid').packery({
  // options...
  itemSelector: '.grid-item'
});
```

With vanilla JavaScript

``` js
// vanilla JS
var grid = document.querySelector('.grid');
// initialize with element
var pckry = new Packery( grid, {
  // options...
  itemSelector: '.grid-item'
});

// initialize with selector string
var pckry = new Packery('.grid', {
  // options...
});
```

With HTML

Add a `data-packery` attribute to your element. Options can be set in JSON in the value.

``` html
<div class="grid" data-packery='{ "itemSelector": ".grid-item" }'>
  <div class="grid-item"></div>
  <div class="grid-item"></div>
  ...
</div>
```

---

By [Metafizzy](http://metafizzy.co)
