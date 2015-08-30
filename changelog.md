# Changelog

### v1.4.3

Updated Outlayer to v1.4.2 for percent position bug fixes. Fixed [#284](https://github.com/metafizzy/packery/issues/284).

### v1.4.2

+ Updated Outlayer to v1.4.1.
  - Added jQuery event triggering.
  - Safari layout and transition fixes
+ Fixed bug with HTML5 drag & drop. Fixed [#206](https://github.com/metafizzy/packery/issues/206)

### v1.4.1

+ Remove `instance` argument from `dragItemPositioned` and `fitComplete` events

## v1.4.0

+ Upgraded Outlayer to `v1.4.0`
  - enabled `percentPosition` option. Fixed [#236](https://github.com/metafizzy/packery/issues/236)
  - removed `instance` argument from `layoutComplete` and `removeComplete`
+ Fixed bugs with Draggabilly v1.2. Fixed [#246](https://github.com/metafizzy/packery/issues/246)
+ Changed `bower.json` `main` to just `js/packery.js`

### v1.3.2

Add 1px wiggle room in `Rect.canFit` and calculations with `columnWidth` & `rowHeight` to allow for pixel rounding errors and JS fractional quirkiness [#42](https://github.com/metafizzy/packery/issues/42) [#227](https://github.com/metafizzy/packery/issues/227)

### v1.3.1

Update [getSize](https://github.com/desandro/get-size) to v1.2.1 to fix IE8 bug

### v1.3.0

+ Add CommonJS and npm support for Browserify [#167](https://github.com/metafizzy/packery/pull/167) [#199](https://github.com/metafizzy/packery/issues/199)
+ Update Outlayer to v1.3.0

### v1.2.5

+ Add space after item removed [#218](https://github.com/metafizzy/packery/issues/218)

### v1.2.4

+ Update Outlayer to v1.2.0

### v1.2.3

+ Add pkgd files in `dist/`
+ Check for zero size in items [#177](https://github.com/metafizzy/packery/issues/218)
+ Fix items bigger than container

### v1.2.1

### v1.2.0

+ Add isHorizontal, for horizontal layouts
