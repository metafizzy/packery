
## To do

<!-- gutter -->

<!-- tests with gutter -->

<!-- selector string for columnWidth, rowHeight, gutter -->

<!-- selector string for placedElements -->

<!-- set element for columnWidth/rowHeight, gutter -->

<!-- declarative mode -->

    <div class="container js-packery" data-packery-options=""></div>

<!-- animation callback -->

<!-- gridded draggable, release item and catch it before placement transition has ended -->

<!-- on resize, don't trigger layout if size hasn't changed -->

<!-- placed draggable item should be on top when released -->

<!-- jQuery plugin-ability (bridget?) -->

<!-- animation
1. set transform to new destination
2. once element reaches destination, remove transform, set top/left -->

<!-- Contributing
- add CodePen links -->

## Bugs

you can drag an item on to a previous dragged item while that previous dragged item is still transitioning

<!-- Drag one item then another will set crazy offsets -->

<!-- IE dragging, try dragging with transitions disabled -->

`dragWithGrid` test for Y position

<!-- getter methods don't work as jQuery plugin. -->

    $('#elem).packery('getItemElements');
    // returns $elem, not the item elements

gutter height throws off .fit()

<!-- fit() items not being transitioned in IE 10 -->

## options

orientation
<!-- rowHeight -->
<!-- columnWidth -->
<!-- placeElements -->
<!-- transitionDuration -->
minSize - throw away empty spaces smaller in width or height


## methods

prepend
<!-- append -->
<!-- destroy -->
<!-- layoutItems -->
<!-- layout -->
add
<!-- remove -->

## Maybe, idunno

<!-- event for drag item position ended -->

<!-- better naming of methods for Draggabilly
dragStart
dragMove
dragStop

dragStart
dragMove
dragEnd -->

<!-- refactor onItemLayout and onItemRemove -->

janky option setter for columnWidth and rowHeight. You have to trigger `_getMeasurements` instead :(

## Future features

infinite scroll

<!-- drag & drop -->


## Test

check how filterFind works
array of elements
nodeList
single element

.add( )

pass in array of elements
pass in parent element, with child elements


.remove() removes correct item

placeElements


1. drag element with columnWidth/rowHeight
2. pull out of grid
3. release
4. Stop transition by clicking on item
5. do not move item
6. release

Item should transition to it destination


## debate

Automatically reveal appended items?

Automatically remove elements from DOM after hiding?

Separate option for gutterWidth and gutterHeight
