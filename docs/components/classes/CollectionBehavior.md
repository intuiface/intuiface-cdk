[**@intuiface/components**](../README.md)

***

# Class: CollectionBehavior

Behavior to manage a collection.

## Extended by

- [`HomogeneousBehavior`](HomogeneousBehavior.md)
- [`IndexingBehavior`](IndexingBehavior.md)
- [`OpeningCollectionBehavior`](OpeningCollectionBehavior.md)
- [`OrientedBehavior`](OrientedBehavior.md)
- [`PannableBehavior`](PannableBehavior.md)
- [`ScrollableBehavior`](ScrollableBehavior.md)

## Properties

### showScrollbars

> **showScrollbars**: `boolean` = `true`

If true, show scrollbars.

***

### visibleItems

> **visibleItems**: `IntuifaceElement`[]

Items.

***

### visibleItemsStartIndex

> **visibleItemsStartIndex**: `number` = `0`

Indicates the start index of the current items requested from collection sources

***

### totalItemsCount

> **totalItemsCount**: `number` = `0`

Total number of items aggregated from each source in this collection

***

### hasInfiniteItems

> **hasInfiniteItems**: `boolean` = `false`

Indicates if this Collection has an infinite number of items.
If true, totalItemsCount if the number of currently known items

***

### hasItems

> **hasItems**: `boolean`

Indicated if the collection has any items
Needed to display ghosts in an empty collection

***

### sources

> `readonly` **sources**: `IntuifaceElement`[] = `[]`

List of sources (IntuifaceElement and DataFeed) for this collection

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


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/