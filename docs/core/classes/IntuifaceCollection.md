# Class: IntuifaceCollection<T\>

`IntuifaceCollection` is the base class to use to implements any kind of collection in Intuiface.

_**This is experimental as there is currently no way to use a custom collection created with the CDK in Intuiface Composer.**_

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ElementContainer`](ElementContainer.md) |

## Hierarchy

- [`IntuifaceElement`](IntuifaceElement.md)

  ↳ **`IntuifaceCollection`**

## Table of contents

### Properties

- [visibleItems](IntuifaceCollection.md#visibleitems)
- [visibleItemsStartIndex](IntuifaceCollection.md#visibleitemsstartindex)
- [totalItemsCount](IntuifaceCollection.md#totalitemscount)
- [hasInfiniteItems](IntuifaceCollection.md#hasinfiniteitems)
- [hasItems](IntuifaceCollection.md#hasitems)
- [sources](IntuifaceCollection.md#sources)
- [container](IntuifaceCollection.md#container)
- [parent](IntuifaceCollection.md#parent)
- [name](IntuifaceCollection.md#name)

### Methods

- [notifyPropertyChanged](IntuifaceCollection.md#notifypropertychanged)
- [subscribeToPropertiesChanges](IntuifaceCollection.md#subscribetopropertieschanges)
- [unsubscribeFromPropertiesChanges](IntuifaceCollection.md#unsubscribefrompropertieschanges)
- [subscribeToPropertyChanged](IntuifaceCollection.md#subscribetopropertychanged)
- [unsubscribeFromPropertyChanged](IntuifaceCollection.md#unsubscribefrompropertychanged)
- [requestItems](IntuifaceCollection.md#requestitems)
- [getStartIndexForSource](IntuifaceCollection.md#getstartindexforsource)
- [initialize](IntuifaceCollection.md#initialize)
- [dispose](IntuifaceCollection.md#dispose)

## Properties

### visibleItems

• **visibleItems**: [`IntuifaceElement`](IntuifaceElement.md)[] = `[]`

Visible items

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

• **hasItems**: `boolean` = `false`

Indicated if the collection has any items
Needed to display ghosts in an empty collection

___

### sources

• `Readonly` **sources**: [`IntuifaceElement`](IntuifaceElement.md)[] = `[]`

List of sources (IntuifaceElement and DataFeed) for this collection

___

### container

• **container**: [`ElementContainer`](ElementContainer.md)

Container of this element

#### Inherited from

[IntuifaceElement](IntuifaceElement.md).[container](IntuifaceElement.md#container)

___

### parent

• **parent**: [`IntuifaceElement`](IntuifaceElement.md)

Parent of this element.

#### Inherited from

[IntuifaceElement](IntuifaceElement.md).[parent](IntuifaceElement.md#parent)

___

### name

• **name**: `string` = `''`

Name of the element.

#### Inherited from

[IntuifaceElement](IntuifaceElement.md).[name](IntuifaceElement.md#name)

## Methods

### notifyPropertyChanged

▸ **notifyPropertyChanged**(`propertyKey`, `value`): `void`

Function to call when a property in the element changed to notify listeners

#### Parameters

| Name | Type |
| :------ | :------ |
| `propertyKey` | `string` |
| `value` | `any` |

#### Returns

`void`

#### Inherited from

[IntuifaceElement](IntuifaceElement.md).[notifyPropertyChanged](IntuifaceElement.md#notifypropertychanged)

___

### subscribeToPropertiesChanges

▸ **subscribeToPropertiesChanges**(`listener`): `void`

Function to subscribe to properties changes of the element

#### Parameters

| Name | Type |
| :------ | :------ |
| `listener` | `PropertiesListener` |

#### Returns

`void`

#### Inherited from

[IntuifaceElement](IntuifaceElement.md).[subscribeToPropertiesChanges](IntuifaceElement.md#subscribetopropertieschanges)

___

### unsubscribeFromPropertiesChanges

▸ **unsubscribeFromPropertiesChanges**(`listener`): `void`

function to unsubscribe from properties changes of the element

#### Parameters

| Name | Type |
| :------ | :------ |
| `listener` | `PropertiesListener` |

#### Returns

`void`

#### Inherited from

[IntuifaceElement](IntuifaceElement.md).[unsubscribeFromPropertiesChanges](IntuifaceElement.md#unsubscribefrompropertieschanges)

___

### subscribeToPropertyChanged

▸ **subscribeToPropertyChanged**(`property`, `listener`): `void`

function to subscribe to one property changed

#### Parameters

| Name | Type |
| :------ | :------ |
| `property` | `string` |
| `listener` | `PropertyListener` |

#### Returns

`void`

#### Inherited from

[IntuifaceElement](IntuifaceElement.md).[subscribeToPropertyChanged](IntuifaceElement.md#subscribetopropertychanged)

___

### unsubscribeFromPropertyChanged

▸ **unsubscribeFromPropertyChanged**(`property`, `listener`): `void`

function to unsubscribe from one property changed

#### Parameters

| Name | Type |
| :------ | :------ |
| `property` | `string` |
| `listener` | `PropertyListener` |

#### Returns

`void`

#### Inherited from

[IntuifaceElement](IntuifaceElement.md).[unsubscribeFromPropertyChanged](IntuifaceElement.md#unsubscribefrompropertychanged)

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
| `source` | [`IntuifaceElement`](IntuifaceElement.md) | source to find |

#### Returns

`number`

___

### initialize

▸ **initialize**(`configuration?`): `void`

Initialize default value of each property.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `configuration?` | `any` | : configuration |

#### Returns

`void`

#### Inherited from

[IntuifaceElement](IntuifaceElement.md).[initialize](IntuifaceElement.md#initialize)

___

### dispose

▸ **dispose**(): `void`

Dispose the element.

#### Returns

`void`

#### Inherited from

[IntuifaceElement](IntuifaceElement.md).[dispose](IntuifaceElement.md#dispose)


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/