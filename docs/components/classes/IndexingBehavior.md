[**@intuiface/components**](../README.md)

***

# Class: IndexingBehavior

Behavior to manage an indexing collection.

## Extends

- [`CollectionBehavior`](CollectionBehavior.md)

## Extended by

- [`FocusingCollectionBehavior`](FocusingCollectionBehavior.md)

## Properties

### showScrollbars

> **showScrollbars**: `boolean` = `true`

If true, show scrollbars.

#### Inherited from

[`CollectionBehavior`](CollectionBehavior.md).[`showScrollbars`](CollectionBehavior.md#showscrollbars)

***

### visibleItems

> **visibleItems**: `IntuifaceElement`[]

Items.

#### Inherited from

[`CollectionBehavior`](CollectionBehavior.md).[`visibleItems`](CollectionBehavior.md#visibleitems)

***

### visibleItemsStartIndex

> **visibleItemsStartIndex**: `number` = `0`

Indicates the start index of the current items requested from collection sources

#### Inherited from

[`CollectionBehavior`](CollectionBehavior.md).[`visibleItemsStartIndex`](CollectionBehavior.md#visibleitemsstartindex)

***

### totalItemsCount

> **totalItemsCount**: `number` = `0`

Total number of items aggregated from each source in this collection

#### Inherited from

[`CollectionBehavior`](CollectionBehavior.md).[`totalItemsCount`](CollectionBehavior.md#totalitemscount)

***

### hasInfiniteItems

> **hasInfiniteItems**: `boolean` = `false`

Indicates if this Collection has an infinite number of items.
If true, totalItemsCount if the number of currently known items

#### Inherited from

[`CollectionBehavior`](CollectionBehavior.md).[`hasInfiniteItems`](CollectionBehavior.md#hasinfiniteitems)

***

### hasItems

> **hasItems**: `boolean`

Indicated if the collection has any items
Needed to display ghosts in an empty collection

#### Inherited from

[`CollectionBehavior`](CollectionBehavior.md).[`hasItems`](CollectionBehavior.md#hasitems)

***

### sources

> `readonly` **sources**: `IntuifaceElement`[] = `[]`

List of sources (IntuifaceElement and DataFeed) for this collection

#### Inherited from

[`CollectionBehavior`](CollectionBehavior.md).[`sources`](CollectionBehavior.md#sources)

***

### selectedIndex

> **selectedIndex**: `number` = `1`

Index in focus.

***

### showControls

> **showControls**: `boolean` = `true`

Indicate controls are displayed

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

[`CollectionBehavior`](CollectionBehavior.md).[`addSource`](CollectionBehavior.md#addsource)

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

[`CollectionBehavior`](CollectionBehavior.md).[`removeSource`](CollectionBehavior.md#removesource)

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

[`CollectionBehavior`](CollectionBehavior.md).[`requestItems`](CollectionBehavior.md#requestitems)

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

[`CollectionBehavior`](CollectionBehavior.md).[`getStartIndexForSource`](CollectionBehavior.md#getstartindexforsource)

***

### raiseReachedIndex()

> **raiseReachedIndex**(`index`): `void`

Index is changed event.

#### Parameters

##### index

`number`

#### Returns

`void`

***

### raiseMovedToPrevious()

> **raiseMovedToPrevious**(): `void`

Is moved to previous event.

#### Returns

`void`

***

### raiseMovedToNext()

> **raiseMovedToNext**(): `void`

Is moved to next event.

#### Returns

`void`

***

### raiseFirstItemReached()

> **raiseFirstItemReached**(): `void`

First item reached event.

#### Returns

`void`

***

### raiseLastItemReached()

> **raiseLastItemReached**(): `void`

Last item reached event.

#### Returns

`void`

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

***

### goToItem()

> **goToItem**(`itemName`): `void`

Action to go to given item's name.

#### Parameters

##### itemName

`string`

#### Returns

`void`

***

### goToNext()

> **goToNext**(): `void`

Action to go to next item.

#### Returns

`void`

***

### goToPrevious()

> **goToPrevious**(): `void`

Action to go to previous item.

#### Returns

`void`

***

### goToFirst()

> **goToFirst**(): `void`

Action to go to first item.

#### Returns

`void`

***

### goToLast()

> **goToLast**(): `void`

Action to go to last item.

#### Returns

`void`


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/