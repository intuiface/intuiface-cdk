# Class: AutoScrollBehavior

Behavior to manage autoscroll in collection.

## Hierarchy

- [`IndexingBehavior`](IndexingBehavior.md)

  ↳ **`AutoScrollBehavior`**

## Table of contents

### Properties

- [autoscroll](AutoScrollBehavior.md#autoscroll)
- [itemDuration](AutoScrollBehavior.md#itemduration)
- [showScrollbars](AutoScrollBehavior.md#showscrollbars)
- [visibleItems](AutoScrollBehavior.md#visibleitems)
- [visibleItemsStartIndex](AutoScrollBehavior.md#visibleitemsstartindex)
- [totalItemsCount](AutoScrollBehavior.md#totalitemscount)
- [hasInfiniteItems](AutoScrollBehavior.md#hasinfiniteitems)
- [hasItems](AutoScrollBehavior.md#hasitems)
- [sources](AutoScrollBehavior.md#sources)
- [selectedIndex](AutoScrollBehavior.md#selectedindex)
- [showControls](AutoScrollBehavior.md#showcontrols)

### Methods

- [startAutoscroll](AutoScrollBehavior.md#startautoscroll)
- [stopAutoscroll](AutoScrollBehavior.md#stopautoscroll)
- [toggleAutoscroll](AutoScrollBehavior.md#toggleautoscroll)
- [addSource](AutoScrollBehavior.md#addsource)
- [removeSource](AutoScrollBehavior.md#removesource)
- [requestItems](AutoScrollBehavior.md#requestitems)
- [getStartIndexForSource](AutoScrollBehavior.md#getstartindexforsource)
- [raiseReachedIndex](AutoScrollBehavior.md#raisereachedindex)
- [raiseMovedToPrevious](AutoScrollBehavior.md#raisemovedtoprevious)
- [raiseMovedToNext](AutoScrollBehavior.md#raisemovedtonext)
- [raiseFirstItemReached](AutoScrollBehavior.md#raisefirstitemreached)
- [raiseLastItemReached](AutoScrollBehavior.md#raiselastitemreached)
- [goToIndex](AutoScrollBehavior.md#gotoindex)
- [goToItem](AutoScrollBehavior.md#gotoitem)
- [goToNext](AutoScrollBehavior.md#gotonext)
- [goToPrevious](AutoScrollBehavior.md#gotoprevious)
- [goToFirst](AutoScrollBehavior.md#gotofirst)
- [goToLast](AutoScrollBehavior.md#gotolast)

## Properties

### autoscroll

• **autoscroll**: `boolean` = `false`

Autoscroll.

___

### itemDuration

• **itemDuration**: `number` = `5`

Duration by item.

___

### showScrollbars

• **showScrollbars**: `boolean` = `true`

If true, show scrollbars.

#### Inherited from

[IndexingBehavior](IndexingBehavior.md).[showScrollbars](IndexingBehavior.md#showscrollbars)

___

### visibleItems

• **visibleItems**: `IntuifaceElement`[]

Items.

#### Inherited from

[IndexingBehavior](IndexingBehavior.md).[visibleItems](IndexingBehavior.md#visibleitems)

___

### visibleItemsStartIndex

• **visibleItemsStartIndex**: `number` = `0`

Indicates the start index of the current items requested from collection sources

#### Inherited from

[IndexingBehavior](IndexingBehavior.md).[visibleItemsStartIndex](IndexingBehavior.md#visibleitemsstartindex)

___

### totalItemsCount

• **totalItemsCount**: `number` = `0`

Total number of items aggregated from each source in this collection

#### Inherited from

[IndexingBehavior](IndexingBehavior.md).[totalItemsCount](IndexingBehavior.md#totalitemscount)

___

### hasInfiniteItems

• **hasInfiniteItems**: `boolean` = `false`

Indicates if this Collection has an infinite number of items.
If true, totalItemsCount if the number of currently known items

#### Inherited from

[IndexingBehavior](IndexingBehavior.md).[hasInfiniteItems](IndexingBehavior.md#hasinfiniteitems)

___

### hasItems

• **hasItems**: `boolean`

Indicated if the collection has any items
Needed to display ghosts in an empty collection

#### Inherited from

[IndexingBehavior](IndexingBehavior.md).[hasItems](IndexingBehavior.md#hasitems)

___

### sources

• `Readonly` **sources**: `IntuifaceElement`[] = `[]`

List of sources (IntuifaceElement and DataFeed) for this collection

#### Inherited from

[IndexingBehavior](IndexingBehavior.md).[sources](IndexingBehavior.md#sources)

___

### selectedIndex

• **selectedIndex**: `number` = `1`

Index in focus.

#### Inherited from

[IndexingBehavior](IndexingBehavior.md).[selectedIndex](IndexingBehavior.md#selectedindex)

___

### showControls

• **showControls**: `boolean` = `true`

Indicate controls are displayed

#### Inherited from

[IndexingBehavior](IndexingBehavior.md).[showControls](IndexingBehavior.md#showcontrols)

## Methods

### startAutoscroll

▸ **startAutoscroll**(`delayMode`): `void`

Start autoscroll.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `delayMode` | `string` | delay mode |

#### Returns

`void`

___

### stopAutoscroll

▸ **stopAutoscroll**(): `void`

Stop autoscroll.

#### Returns

`void`

___

### toggleAutoscroll

▸ **toggleAutoscroll**(): `void`

Toggle autoscroll.

#### Returns

`void`

___

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

[IndexingBehavior](IndexingBehavior.md).[addSource](IndexingBehavior.md#addsource)

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

[IndexingBehavior](IndexingBehavior.md).[removeSource](IndexingBehavior.md#removesource)

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

[IndexingBehavior](IndexingBehavior.md).[requestItems](IndexingBehavior.md#requestitems)

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

[IndexingBehavior](IndexingBehavior.md).[getStartIndexForSource](IndexingBehavior.md#getstartindexforsource)

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

#### Inherited from

[IndexingBehavior](IndexingBehavior.md).[raiseReachedIndex](IndexingBehavior.md#raisereachedindex)

___

### raiseMovedToPrevious

▸ **raiseMovedToPrevious**(): `void`

Is moved to previous event.

#### Returns

`void`

#### Inherited from

[IndexingBehavior](IndexingBehavior.md).[raiseMovedToPrevious](IndexingBehavior.md#raisemovedtoprevious)

___

### raiseMovedToNext

▸ **raiseMovedToNext**(): `void`

Is moved to next event.

#### Returns

`void`

#### Inherited from

[IndexingBehavior](IndexingBehavior.md).[raiseMovedToNext](IndexingBehavior.md#raisemovedtonext)

___

### raiseFirstItemReached

▸ **raiseFirstItemReached**(): `void`

First item reached event.

#### Returns

`void`

#### Inherited from

[IndexingBehavior](IndexingBehavior.md).[raiseFirstItemReached](IndexingBehavior.md#raisefirstitemreached)

___

### raiseLastItemReached

▸ **raiseLastItemReached**(): `void`

Last item reached event.

#### Returns

`void`

#### Inherited from

[IndexingBehavior](IndexingBehavior.md).[raiseLastItemReached](IndexingBehavior.md#raiselastitemreached)

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

#### Inherited from

[IndexingBehavior](IndexingBehavior.md).[goToIndex](IndexingBehavior.md#gotoindex)

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

#### Inherited from

[IndexingBehavior](IndexingBehavior.md).[goToItem](IndexingBehavior.md#gotoitem)

___

### goToNext

▸ **goToNext**(): `void`

Action to go to next item.

#### Returns

`void`

#### Inherited from

[IndexingBehavior](IndexingBehavior.md).[goToNext](IndexingBehavior.md#gotonext)

___

### goToPrevious

▸ **goToPrevious**(): `void`

Action to go to previous item.

#### Returns

`void`

#### Inherited from

[IndexingBehavior](IndexingBehavior.md).[goToPrevious](IndexingBehavior.md#gotoprevious)

___

### goToFirst

▸ **goToFirst**(): `void`

Action to go to first item.

#### Returns

`void`

#### Inherited from

[IndexingBehavior](IndexingBehavior.md).[goToFirst](IndexingBehavior.md#gotofirst)

___

### goToLast

▸ **goToLast**(): `void`

Action to go to last item.

#### Returns

`void`

#### Inherited from

[IndexingBehavior](IndexingBehavior.md).[goToLast](IndexingBehavior.md#gotolast)


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/