# Packery

_Bin-packing layout library_

See [packery.metafizzy.co](http://packery.metafizzy.co) for complete docs and demos

## Install

### Download

+ [packery.pkgd.js](https://unpkg.com/packery@2.1/dist/packery.pkgd.js) un-minified, or
+ [packery.pkgd.min.js](https://unpkg.com/packery@2.1/dist/packery.pkgd.min.js) minified

### CDN

Link directly to Packery files on [unpkg](https://unpkg.com).

``` html
<script src="https://unpkg.com/packery@2.1/dist/packery.pkgd.js"></script>
<!-- or -->
<script src="https://unpkg.com/packery@2.1/dist/packery.pkgd.min.js"></script>
```

### Package managers

Bower: `bower install packery --save`

[npm](https://www.npmjs.com/package/packery): `npm install packery --save`

## License

### Commercial license

If you want to use Packery to develop commercial sites, themes, projects, and applications, the Commercial license is the appropriate license. With this option, your source code is kept proprietary. Purchase a Packery Commercial License at [packery.metafizzy.co](http://packery.metafizzy.co/#commercial-license)

### Open source license

If you are creating an open source application under a license compatible with the [GNU GPL license v3](https://www.gnu.org/licenses/gpl-3.0.html), you may use Packery under the terms of the GPLv3.

[Read more about Packery's license](http://packery.metafizzy.co/packery.html).

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
