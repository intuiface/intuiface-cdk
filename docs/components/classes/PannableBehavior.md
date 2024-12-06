[**@intuiface/components**](../README.md) • **Docs**

***

# Class: PannableBehavior

Behavior to manage a pannable collection.

## Extends

- [`CollectionBehavior`](CollectionBehavior.md)

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

### allowScroll

> **allowScroll**: `boolean` = `true`

Allow scroll

***

### allowInteractionWithItems

> **allowInteractionWithItems**: `boolean` = `true`

If true, items can be interacted with

## Methods

### addSource()

> **addSource**(`source`, `index`): `void`

Add a source

#### Parameters

• **source**: `IntuifaceElement`

: source to add

• **index**: `number` = `undefined`

#### Returns

`void`

#### Inherited from

[`CollectionBehavior`](CollectionBehavior.md).[`addSource`](CollectionBehavior.md#addsource)

***

### removeSource()

> **removeSource**(`source`): `void`

Remove a source

#### Parameters

• **source**: `IntuifaceElement`

: source to remove

#### Returns

`void`

#### Inherited from

[`CollectionBehavior`](CollectionBehavior.md).[`removeSource`](CollectionBehavior.md#removesource)

***

### requestItems()

> **requestItems**(`start`, `count`): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Requests items of the collection

#### Parameters

• **start**: `number`

start index of the requested items

• **count**: `number`

number of requested items

#### Returns

[`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

#### Inherited from

[`CollectionBehavior`](CollectionBehavior.md).[`requestItems`](CollectionBehavior.md#requestitems)

***

### getStartIndexForSource()

> **getStartIndexForSource**(`source`): `number`

Gets the start index in overall items for the given source

#### Parameters

• **source**: `IntuifaceElement`

soure to find

#### Returns

`number`

#### Inherited from

[`CollectionBehavior`](CollectionBehavior.md).[`getStartIndexForSource`](CollectionBehavior.md#getstartindexforsource)


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/