# Class: CollectionBehavior

Behavior to manage a collection.

## Hierarchy

- **`CollectionBehavior`**

  ↳ [`HomogeneousBehavior`](HomogeneousBehavior.md)

  ↳ [`IndexingBehavior`](IndexingBehavior.md)

  ↳ [`OpeningCollectionBehavior`](OpeningCollectionBehavior.md)

  ↳ [`OrientedBehavior`](OrientedBehavior.md)

  ↳ [`PannableBehavior`](PannableBehavior.md)

  ↳ [`ScrollableBehavior`](ScrollableBehavior.md)

## Table of contents

### Properties

- [showScrollbars](CollectionBehavior.md#showscrollbars)
- [visibleItems](CollectionBehavior.md#visibleitems)
- [visibleItemsStartIndex](CollectionBehavior.md#visibleitemsstartindex)
- [totalItemsCount](CollectionBehavior.md#totalitemscount)
- [hasInfiniteItems](CollectionBehavior.md#hasinfiniteitems)
- [hasItems](CollectionBehavior.md#hasitems)
- [sources](CollectionBehavior.md#sources)

### Methods

- [addSource](CollectionBehavior.md#addsource)
- [removeSource](CollectionBehavior.md#removesource)
- [requestItems](CollectionBehavior.md#requestitems)
- [getStartIndexForSource](CollectionBehavior.md#getstartindexforsource)

## Properties

### showScrollbars

• **showScrollbars**: `boolean` = `true`

If true, show scrollbars.

___

### visibleItems

• **visibleItems**: `IntuifaceElement`[]

Items.

___

### visibleItemsStartIndex

• **visibleItemsStartIndex**: `number` = `0`

Indicates the start index of the current items requested from collection sources

___

### totalItemsCount

• **totalItemsCount**: `number` = `0`

Total number of items aggregated from each source in this collection

___

### hasInfiniteItems

• **hasInfiniteItems**: `boolean` = `false`

Indicates if this Collection has an infinite number of items.
If true, totalItemsCount if the number of currently known items

___

### hasItems

• **hasItems**: `boolean`

Indicated if the collection has any items
Needed to display ghosts in an empty collection

___

### sources

• `Readonly` **sources**: `IntuifaceElement`[] = `[]`

List of sources (IntuifaceElement and DataFeed) for this collection

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


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/