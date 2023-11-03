# Class: PannableBehavior

Behavior to manage a pannable collection.

## Hierarchy

- [`CollectionBehavior`](CollectionBehavior.md)

  ↳ **`PannableBehavior`**

## Table of contents

### Properties

- [showScrollbars](PannableBehavior.md#showscrollbars)
- [visibleItems](PannableBehavior.md#visibleitems)
- [visibleItemsStartIndex](PannableBehavior.md#visibleitemsstartindex)
- [totalItemsCount](PannableBehavior.md#totalitemscount)
- [hasInfiniteItems](PannableBehavior.md#hasinfiniteitems)
- [hasItems](PannableBehavior.md#hasitems)
- [sources](PannableBehavior.md#sources)
- [allowScroll](PannableBehavior.md#allowscroll)
- [allowInteractionWithItems](PannableBehavior.md#allowinteractionwithitems)

### Methods

- [addSource](PannableBehavior.md#addsource)
- [removeSource](PannableBehavior.md#removesource)
- [requestItems](PannableBehavior.md#requestitems)
- [getStartIndexForSource](PannableBehavior.md#getstartindexforsource)

## Properties

### showScrollbars

• **showScrollbars**: `boolean` = `true`

If true, show scrollbars.

#### Inherited from

[CollectionBehavior](CollectionBehavior.md).[showScrollbars](CollectionBehavior.md#showscrollbars)

___

### visibleItems

• **visibleItems**: `IntuifaceElement`[]

Items.

#### Inherited from

[CollectionBehavior](CollectionBehavior.md).[visibleItems](CollectionBehavior.md#visibleitems)

___

### visibleItemsStartIndex

• **visibleItemsStartIndex**: `number` = `0`

Indicates the start index of the current items requested from collection sources

#### Inherited from

[CollectionBehavior](CollectionBehavior.md).[visibleItemsStartIndex](CollectionBehavior.md#visibleitemsstartindex)

___

### totalItemsCount

• **totalItemsCount**: `number` = `0`

Total number of items aggregated from each source in this collection

#### Inherited from

[CollectionBehavior](CollectionBehavior.md).[totalItemsCount](CollectionBehavior.md#totalitemscount)

___

### hasInfiniteItems

• **hasInfiniteItems**: `boolean` = `false`

Indicates if this Collection has an infinite number of items.
If true, totalItemsCount if the number of currently known items

#### Inherited from

[CollectionBehavior](CollectionBehavior.md).[hasInfiniteItems](CollectionBehavior.md#hasinfiniteitems)

___

### hasItems

• **hasItems**: `boolean`

Indicated if the collection has any items
Needed to display ghosts in an empty collection

#### Inherited from

[CollectionBehavior](CollectionBehavior.md).[hasItems](CollectionBehavior.md#hasitems)

___

### sources

• `Readonly` **sources**: `IntuifaceElement`[] = `[]`

List of sources (IntuifaceElement and DataFeed) for this collection

#### Inherited from

[CollectionBehavior](CollectionBehavior.md).[sources](CollectionBehavior.md#sources)

___

### allowScroll

• **allowScroll**: `boolean` = `true`

Allow scroll

___

### allowInteractionWithItems

• **allowInteractionWithItems**: `boolean` = `true`

If true, items can be interacted with

## Methods

### addSource

▸ **addSource**(`source`, `index?`): `void`

Add a source

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `source` | `IntuifaceElement` | `undefined` | : source to add |
| `index` | `number` | `undefined` | - |

#### Returns

`void`

#### Inherited from

[CollectionBehavior](CollectionBehavior.md).[addSource](CollectionBehavior.md#addsource)

___

### removeSource

▸ **removeSource**(`source`): `void`

Remove a source

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `source` | `IntuifaceElement` | : source to remove |

#### Returns

`void`

#### Inherited from

[CollectionBehavior](CollectionBehavior.md).[removeSource](CollectionBehavior.md#removesource)

___

### requestItems

▸ **requestItems**(`start`, `count`): [`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<`void`\>

Requests items of the collection

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `start` | `number` | start index of the requested items |
| `count` | `number` | number of requested items |

#### Returns

[`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<`void`\>

#### Inherited from

[CollectionBehavior](CollectionBehavior.md).[requestItems](CollectionBehavior.md#requestitems)

___

### getStartIndexForSource

▸ **getStartIndexForSource**(`source`): `number`

Gets the start index in overall items for the given source

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `source` | `IntuifaceElement` | soure to find |

#### Returns

`number`

#### Inherited from

[CollectionBehavior](CollectionBehavior.md).[getStartIndexForSource](CollectionBehavior.md#getstartindexforsource)


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/