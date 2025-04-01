[**@intuiface/core**](../README.md) • **Docs**

***

# Class: IntuifaceCollection\<T\>

**`Experimental`**

`IntuifaceCollection` is the base class to use to implements any kind of collection in Intuiface.

_**This is experimental as there is currently no way to use a custom collection created with the CDK in Intuiface Composer.**_

## Extends

- [`IntuifaceElement`](IntuifaceElement.md)

## Type Parameters

• **T** *extends* [`ElementContainer`](ElementContainer.md)

## Constructors

### new IntuifaceCollection()

> **new IntuifaceCollection**\<`T`\>(): [`IntuifaceCollection`](IntuifaceCollection.md)\<`T`\>

**`Experimental`**

#### Returns

[`IntuifaceCollection`](IntuifaceCollection.md)\<`T`\>

#### Inherited from

`IntuifaceElement.constructor`

## Properties

### visibleItems

> **visibleItems**: [`IntuifaceElement`](IntuifaceElement.md)[] = `[]`

**`Experimental`**

Visible items

***

### visibleItemsStartIndex

> **visibleItemsStartIndex**: `number` = `0`

**`Experimental`**

Indicates the start index of the current items requested from collection sources

***

### totalItemsCount

> **totalItemsCount**: `number` = `0`

**`Experimental`**

Total number of items aggregated from each source in this collection

***

### hasInfiniteItems

> **hasInfiniteItems**: `boolean` = `false`

**`Experimental`**

Indicates if this Collection has an infinite number of items.
If true, totalItemsCount if the number of currently known items

***

### hasItems

> **hasItems**: `boolean` = `false`

**`Experimental`**

Indicated if the collection has any items
Needed to display ghosts in an empty collection

***

### sources

> `readonly` **sources**: [`IntuifaceElement`](IntuifaceElement.md)[] = `[]`

**`Experimental`**

List of sources (IntuifaceElement and DataFeed) for this collection

***

### container

> **container**: [`ElementContainer`](ElementContainer.md)

**`Experimental`**

Container of this element

#### Inherited from

[`IntuifaceElement`](IntuifaceElement.md).[`container`](IntuifaceElement.md#container)

***

### parent

> **parent**: [`IntuifaceElement`](IntuifaceElement.md)

**`Experimental`**

Parent of this element.

#### Inherited from

[`IntuifaceElement`](IntuifaceElement.md).[`parent`](IntuifaceElement.md#parent)

***

### name

> **name**: `string` = `''`

**`Experimental`**

Name of the element.

#### Inherited from

[`IntuifaceElement`](IntuifaceElement.md).[`name`](IntuifaceElement.md#name)

## Methods

### notifyPropertyChanged()

> **notifyPropertyChanged**(`propertyKey`, `value`): `void`

**`Experimental`**

#### Parameters

• **propertyKey**: `string`

• **value**: `any`

#### Returns

`void`

#### Inherited from

[`IntuifaceElement`](IntuifaceElement.md).[`notifyPropertyChanged`](IntuifaceElement.md#notifypropertychanged)

***

### subscribeToPropertiesChanges()

> **subscribeToPropertiesChanges**(`listener`): `void`

**`Experimental`**

#### Parameters

• **listener**: `PropertiesListener`

#### Returns

`void`

#### Inherited from

[`IntuifaceElement`](IntuifaceElement.md).[`subscribeToPropertiesChanges`](IntuifaceElement.md#subscribetopropertieschanges)

***

### unsubscribeFromPropertiesChanges()

> **unsubscribeFromPropertiesChanges**(`listener`): `void`

**`Experimental`**

#### Parameters

• **listener**: `PropertiesListener`

#### Returns

`void`

#### Inherited from

[`IntuifaceElement`](IntuifaceElement.md).[`unsubscribeFromPropertiesChanges`](IntuifaceElement.md#unsubscribefrompropertieschanges)

***

### subscribeToPropertyChanged()

> **subscribeToPropertyChanged**(`property`, `listener`): `void`

**`Experimental`**

#### Parameters

• **property**: `string`

• **listener**: `PropertyListener`

#### Returns

`void`

#### Inherited from

[`IntuifaceElement`](IntuifaceElement.md).[`subscribeToPropertyChanged`](IntuifaceElement.md#subscribetopropertychanged)

***

### unsubscribeFromPropertyChanged()

> **unsubscribeFromPropertyChanged**(`property`, `listener`): `void`

**`Experimental`**

#### Parameters

• **property**: `string`

• **listener**: `PropertyListener`

#### Returns

`void`

#### Inherited from

[`IntuifaceElement`](IntuifaceElement.md).[`unsubscribeFromPropertyChanged`](IntuifaceElement.md#unsubscribefrompropertychanged)

***

### requestItems()

> **requestItems**(`start`, `count`): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

**`Experimental`**

#### Parameters

• **start**: `number`

start index of the requested items

• **count**: `number`

number of requested items

#### Returns

[`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

***

### getStartIndexForSource()

> **getStartIndexForSource**(`source`): `number`

**`Experimental`**

#### Parameters

• **source**: [`IntuifaceElement`](IntuifaceElement.md)

source to find

#### Returns

`number`

***

### initialize()

> **initialize**(`configuration`?): `void`

**`Experimental`**

#### Parameters

• **configuration?**: `any`

: configuration

#### Returns

`void`

#### Inherited from

[`IntuifaceElement`](IntuifaceElement.md).[`initialize`](IntuifaceElement.md#initialize)

***

### dispose()

> **dispose**(): `void`

**`Experimental`**

#### Returns

`void`

#### Inherited from

[`IntuifaceElement`](IntuifaceElement.md).[`dispose`](IntuifaceElement.md#dispose)


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/