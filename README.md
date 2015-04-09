# Packery

_Bin-packing layout library_

See http://packery.metafizzy.co for complete docs and demos

## Install

Download a packaged source file:

+ [packery.pkgd.js](http://packeryjs.com/packery.pkgd.js)
+ [packery.pkgd.min.js](http://packeryjs.com/packery.pkgd.min.js)

Install with [Bower :bird:](http://bower.io): `bower install packery --save`

[Install with npm](https://www.npmjs.com/package/packery): `npm install packery`

## License

### Commerical license

If you want to use Packery to develop commercial sites, themes, projects, and applications, the Commercial license is the appropriate license. With this option, your source code is kept proprietary. Purchase a Packery Commercial License at [packery.metafizzy.co](http://packery.metafizzy.co/#commerical-license)

### Open source license

If you are creating an open source application under a license compatible with the [GNU GPL license v3](https://www.gnu.org/licenses/gpl-3.0.html), you may use Packery under the terms of the GPLv3.

[Read more about Packery's license](http://packery.metafizzy.co/packery.html).

## Initialize

### in JavaScript

``` js
var container = document.querySelector('#container');
var myPackery = new Packery( container, {
  // options...
});
```

### in HTML

Add a class of `js-packery` to your element. Options can be set in JSON in `data-packery-options`.

``` html
<div class="js-packery" data-packery-options='{ "itemSelector": ".item" }'>
  ...
</div>
```

---

Copyright (c) 2015 Metafizzy
