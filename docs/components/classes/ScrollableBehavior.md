# Class: ScrollableBehavior

Behavior to manage an indexing collection.

## Hierarchy

- [`CollectionBehavior`](CollectionBehavior.md)

  ↳ **`ScrollableBehavior`**

## Table of contents

### Properties

- [showScrollbars](ScrollableBehavior.md#showscrollbars)
- [visibleItems](ScrollableBehavior.md#visibleitems)
- [visibleItemsStartIndex](ScrollableBehavior.md#visibleitemsstartindex)
- [totalItemsCount](ScrollableBehavior.md#totalitemscount)
- [hasInfiniteItems](ScrollableBehavior.md#hasinfiniteitems)
- [hasItems](ScrollableBehavior.md#hasitems)
- [sources](ScrollableBehavior.md#sources)
- [scrollOffset](ScrollableBehavior.md#scrolloffset)
- [scrollViewerHorizontalOffset](ScrollableBehavior.md#scrollviewerhorizontaloffset)
- [scrollViewerVerticalOffset](ScrollableBehavior.md#scrollviewerverticaloffset)
- [showScrollIndicator](ScrollableBehavior.md#showscrollindicator)
- [initialScrollEffect](ScrollableBehavior.md#initialscrolleffect)
- [initialRecenterTime](ScrollableBehavior.md#initialrecentertime)
- [recenterTime](ScrollableBehavior.md#recentertime)
- [allowElasticity](ScrollableBehavior.md#allowelasticity)
- [isScrolling](ScrollableBehavior.md#isscrolling)
- [softMoveSpeed](ScrollableBehavior.md#softmovespeed)

### Methods

- [addSource](ScrollableBehavior.md#addsource)
- [removeSource](ScrollableBehavior.md#removesource)
- [requestItems](ScrollableBehavior.md#requestitems)
- [getStartIndexForSource](ScrollableBehavior.md#getstartindexforsource)
- [raiseIsScrolled](ScrollableBehavior.md#raiseisscrolled)
- [scrollToOffset](ScrollableBehavior.md#scrolltooffset)

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

### scrollOffset

• **scrollOffset**: `number` = `0`

The scroll offset

___

### scrollViewerHorizontalOffset

• **scrollViewerHorizontalOffset**: `number` = `0`

Horizontal offset

___

### scrollViewerVerticalOffset

• **scrollViewerVerticalOffset**: `number` = `0`

Vertical offset

___

### showScrollIndicator

• **showScrollIndicator**: `boolean` = `true`

Show control indicator

___

### initialScrollEffect

• **initialScrollEffect**: `boolean` = `true`

Indicates if there is an intial scroll effect or not.

___

### initialRecenterTime

• **initialRecenterTime**: `number` = `3`

Initial recenter time.

___

### recenterTime

• **recenterTime**: `number` = `1`

Recenter time.

___

### allowElasticity

• **allowElasticity**: `boolean` = `true`

Elasticity at boundary

___

### isScrolling

• **isScrolling**: `boolean` = `false`

Indicates if the collection is being scrolled

___

### softMoveSpeed

• **softMoveSpeed**: `number` = `0.95`

Soft move speed

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

### raiseIsScrolled

▸ **raiseIsScrolled**(): `void`

Scrolled event.

#### Returns

`void`

___

### scrollToOffset

▸ **scrollToOffset**(`offset`): `void`

Scroll to a given offset in pixels

#### Parameters

| Name | Type |
| :------ | :------ |
| `offset` | `number` |

#### Returns

`void`


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/