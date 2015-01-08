# Packery

_Bin-packing layout library_

See http://packery.metafizzy.co for complete docs and demos

## Install

Download a packaged source file:

+ [packery.pkgd.js](http://packeryjs.com/packery.pkgd.js)
+ [packery.pkgd.min.js](http://packeryjs.com/packery.pkgd.min.js)

Install with [Bower :bird:](http://bower.io): `bower install packery`

[Install with npm](https://www.npmjs.org/package/packery): `npm install packery`

## Commercial license

Packery may be used in commercial projects and applications with the one-time purchase of a commercial license. If you are paid to do your job, and part of your job is implementing Packery, a commercial license is required.

http://packery.metafizzy.co/license.html

For non-commercial, personal, or open source projects and applications, you may use Packery under the terms of the [GPL v3 License](http://choosealicense.com/licenses/gpl-v3/). You may use Packery for free.

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
