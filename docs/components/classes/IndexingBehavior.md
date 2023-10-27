# Class: IndexingBehavior

Behavior to manage an indexing collection.

## Hierarchy

- [`CollectionBehavior`](CollectionBehavior.md)

  ↳ **`IndexingBehavior`**

  ↳↳ [`AutoScrollBehavior`](AutoScrollBehavior.md)

  ↳↳ [`FocusingCollectionBehavior`](FocusingCollectionBehavior.md)

## Table of contents

### Properties

- [showScrollbars](IndexingBehavior.md#showscrollbars)
- [visibleItems](IndexingBehavior.md#visibleitems)
- [visibleItemsStartIndex](IndexingBehavior.md#visibleitemsstartindex)
- [totalItemsCount](IndexingBehavior.md#totalitemscount)
- [hasInfiniteItems](IndexingBehavior.md#hasinfiniteitems)
- [hasItems](IndexingBehavior.md#hasitems)
- [sources](IndexingBehavior.md#sources)
- [selectedIndex](IndexingBehavior.md#selectedindex)
- [showControls](IndexingBehavior.md#showcontrols)

### Methods

- [addSource](IndexingBehavior.md#addsource)
- [removeSource](IndexingBehavior.md#removesource)
- [requestItems](IndexingBehavior.md#requestitems)
- [getStartIndexForSource](IndexingBehavior.md#getstartindexforsource)
- [raiseReachedIndex](IndexingBehavior.md#raisereachedindex)
- [raiseMovedToPrevious](IndexingBehavior.md#raisemovedtoprevious)
- [raiseMovedToNext](IndexingBehavior.md#raisemovedtonext)
- [raiseFirstItemReached](IndexingBehavior.md#raisefirstitemreached)
- [raiseLastItemReached](IndexingBehavior.md#raiselastitemreached)
- [goToIndex](IndexingBehavior.md#gotoindex)
- [goToItem](IndexingBehavior.md#gotoitem)
- [goToNext](IndexingBehavior.md#gotonext)
- [goToPrevious](IndexingBehavior.md#gotoprevious)
- [goToFirst](IndexingBehavior.md#gotofirst)
- [goToLast](IndexingBehavior.md#gotolast)

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

### selectedIndex

• **selectedIndex**: `number` = `1`

Index in focus.

___

### showControls

• **showControls**: `boolean` = `true`

Indicate controls are displayed

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

___

### raiseReachedIndex

▸ **raiseReachedIndex**(`index`): `void`

Index is changed event.

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `number` |

#### Returns

`void`

___

### raiseMovedToPrevious

▸ **raiseMovedToPrevious**(): `void`

Is moved to previous event.

#### Returns

`void`

___

### raiseMovedToNext

▸ **raiseMovedToNext**(): `void`

Is moved to next event.

#### Returns

`void`

___

### raiseFirstItemReached

▸ **raiseFirstItemReached**(): `void`

First item reached event.

#### Returns

`void`

___

### raiseLastItemReached

▸ **raiseLastItemReached**(): `void`

Last item reached event.

#### Returns

`void`

___

### goToIndex

▸ **goToIndex**(`index`): `void`

Action to go to given index.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `index` | `number` | index to reach |

#### Returns

`void`

___

### goToItem

▸ **goToItem**(`itemName`): `void`

Action to go to given item's name.

#### Parameters

| Name | Type |
| :------ | :------ |
| `itemName` | `string` |

#### Returns

`void`

___

### goToNext

▸ **goToNext**(): `void`

Action to go to next item.

#### Returns

`void`

___

### goToPrevious

▸ **goToPrevious**(): `void`

Action to go to previous item.

#### Returns

`void`

___

### goToFirst

▸ **goToFirst**(): `void`

Action to go to first item.

#### Returns

`void`

___

### goToLast

▸ **goToLast**(): `void`

Action to go to last item.

#### Returns

`void`


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/