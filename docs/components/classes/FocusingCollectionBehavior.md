[**@intuiface/components**](../README.md)

***

# Class: FocusingCollectionBehavior

Behavior to manage a focusing collection.

## Extends

- [`IndexingBehavior`](IndexingBehavior.md)

## Properties

### showScrollbars

> **showScrollbars**: `boolean` = `true`

If true, show scrollbars.

#### Inherited from

[`IndexingBehavior`](IndexingBehavior.md).[`showScrollbars`](IndexingBehavior.md#showscrollbars)

***

### visibleItems

> **visibleItems**: `IntuifaceElement`[]

Items.

#### Inherited from

[`IndexingBehavior`](IndexingBehavior.md).[`visibleItems`](IndexingBehavior.md#visibleitems)

***

### visibleItemsStartIndex

> **visibleItemsStartIndex**: `number` = `0`

Indicates the start index of the current items requested from collection sources

#### Inherited from

[`IndexingBehavior`](IndexingBehavior.md).[`visibleItemsStartIndex`](IndexingBehavior.md#visibleitemsstartindex)

***

### totalItemsCount

> **totalItemsCount**: `number` = `0`

Total number of items aggregated from each source in this collection

#### Inherited from

[`IndexingBehavior`](IndexingBehavior.md).[`totalItemsCount`](IndexingBehavior.md#totalitemscount)

***

### hasInfiniteItems

> **hasInfiniteItems**: `boolean` = `false`

Indicates if this Collection has an infinite number of items.
If true, totalItemsCount if the number of currently known items

#### Inherited from

[`IndexingBehavior`](IndexingBehavior.md).[`hasInfiniteItems`](IndexingBehavior.md#hasinfiniteitems)

***

### hasItems

> **hasItems**: `boolean`

Indicated if the collection has any items
Needed to display ghosts in an empty collection

#### Inherited from

[`IndexingBehavior`](IndexingBehavior.md).[`hasItems`](IndexingBehavior.md#hasitems)

***

### sources

> `readonly` **sources**: `IntuifaceElement`[] = `[]`

List of sources (IntuifaceElement and DataFeed) for this collection

#### Inherited from

[`IndexingBehavior`](IndexingBehavior.md).[`sources`](IndexingBehavior.md#sources)

***

### focusedElements

> **focusedElements**: `IntuifaceElement`[] = `[]`

Focused elements.

***

### numberOfItemsInFocus

> **numberOfItemsInFocus**: `number` = `1`

Number of items considered in focus, and thus that can be tapped (without navigating) or dragged and dropped

***

### swipeSensitivity

> **swipeSensitivity**: `number` = `200`

Swipe sensitivity.

***

### selectedIndex

> **selectedIndex**: `number` = `1`

Index in focus.

#### Inherited from

[`IndexingBehavior`](IndexingBehavior.md).[`selectedIndex`](IndexingBehavior.md#selectedindex)

***

### showControls

> **showControls**: `boolean` = `true`

Indicate controls are displayed

#### Inherited from

[`IndexingBehavior`](IndexingBehavior.md).[`showControls`](IndexingBehavior.md#showcontrols)

## Methods

### addSource()

> **addSource**(`source`, `index?`): `void`

Add a source

#### Parameters

##### source

`IntuifaceElement`

: source to add

##### index?

`number` = `undefined`

#### Returns

`void`

#### Inherited from

[`IndexingBehavior`](IndexingBehavior.md).[`addSource`](IndexingBehavior.md#addsource)

***

### removeSource()

> **removeSource**(`source`): `void`

Remove a source

#### Parameters

##### source

`IntuifaceElement`

: source to remove

#### Returns

`void`

#### Inherited from

[`IndexingBehavior`](IndexingBehavior.md).[`removeSource`](IndexingBehavior.md#removesource)

***

### requestItems()

> **requestItems**(`start`, `count`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Requests items of the collection

#### Parameters

##### start

`number`

start index of the requested items

##### count

`number`

number of requested items

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

#### Inherited from

[`IndexingBehavior`](IndexingBehavior.md).[`requestItems`](IndexingBehavior.md#requestitems)

***

### getStartIndexForSource()

> **getStartIndexForSource**(`source`): `number`

Gets the start index in overall items for the given source

#### Parameters

##### source

`IntuifaceElement`

soure to find

#### Returns

`number`

#### Inherited from

[`IndexingBehavior`](IndexingBehavior.md).[`getStartIndexForSource`](IndexingBehavior.md#getstartindexforsource)

***

### raiseReachedIndex()

> **raiseReachedIndex**(`index`): `void`

Index is changed event.

#### Parameters

##### index

`number`

#### Returns

`void`

#### Inherited from

[`IndexingBehavior`](IndexingBehavior.md).[`raiseReachedIndex`](IndexingBehavior.md#raisereachedindex)

***

### raiseMovedToPrevious()

> **raiseMovedToPrevious**(): `void`

Is moved to previous event.

#### Returns

`void`

#### Inherited from

[`IndexingBehavior`](IndexingBehavior.md).[`raiseMovedToPrevious`](IndexingBehavior.md#raisemovedtoprevious)

***

### raiseMovedToNext()

> **raiseMovedToNext**(): `void`

Is moved to next event.

#### Returns

`void`

#### Inherited from

[`IndexingBehavior`](IndexingBehavior.md).[`raiseMovedToNext`](IndexingBehavior.md#raisemovedtonext)

***

### raiseFirstItemReached()

> **raiseFirstItemReached**(): `void`

First item reached event.

#### Returns

`void`

#### Inherited from

[`IndexingBehavior`](IndexingBehavior.md).[`raiseFirstItemReached`](IndexingBehavior.md#raisefirstitemreached)

***

### raiseLastItemReached()

> **raiseLastItemReached**(): `void`

Last item reached event.

#### Returns

`void`

#### Inherited from

[`IndexingBehavior`](IndexingBehavior.md).[`raiseLastItemReached`](IndexingBehavior.md#raiselastitemreached)

***

### goToIndex()

> **goToIndex**(`index`): `void`

Action to go to given index.

#### Parameters

##### index

`number`

index to reach

#### Returns

`void`

#### Inherited from

[`IndexingBehavior`](IndexingBehavior.md).[`goToIndex`](IndexingBehavior.md#gotoindex)

***

### goToItem()

> **goToItem**(`itemName`): `void`

Action to go to given item's name.

#### Parameters

##### itemName

`string`

#### Returns

`void`

#### Inherited from

[`IndexingBehavior`](IndexingBehavior.md).[`goToItem`](IndexingBehavior.md#gotoitem)

***

### goToNext()

> **goToNext**(): `void`

Action to go to next item.

#### Returns

`void`

#### Inherited from

[`IndexingBehavior`](IndexingBehavior.md).[`goToNext`](IndexingBehavior.md#gotonext)

***

### goToPrevious()

> **goToPrevious**(): `void`

Action to go to previous item.

#### Returns

`void`

#### Inherited from

[`IndexingBehavior`](IndexingBehavior.md).[`goToPrevious`](IndexingBehavior.md#gotoprevious)

***

### goToFirst()

> **goToFirst**(): `void`

Action to go to first item.

#### Returns

`void`

#### Inherited from

[`IndexingBehavior`](IndexingBehavior.md).[`goToFirst`](IndexingBehavior.md#gotofirst)

***

### goToLast()

> **goToLast**(): `void`

Action to go to last item.

#### Returns

`void`

#### Inherited from

[`IndexingBehavior`](IndexingBehavior.md).[`goToLast`](IndexingBehavior.md#gotolast)


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/