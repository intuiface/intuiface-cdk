[**@intuiface/core**](../README.md) • **Docs**

***

# Class: IntuifaceElement

An `IntuifaceElement` represents the base of any kind of element that compose an Intuiface experience: asset, collection, interface asset, layer, scene, experience...

All this elements extends `IntuifaceElement` and use the appropriate decorator to make it usable in the experience, such as [`@Asset`](../functions/Asset.md) or [`@Collection`](../functions/Collection.md).

## Extends

- [`Watchable`](Watchable.md)

## Extended by

- [`IntuifaceCollection`](IntuifaceCollection.md)

## Properties

### container

> **container**: [`ElementContainer`](ElementContainer.md)

Container of this element

***

### parent

> **parent**: [`IntuifaceElement`](IntuifaceElement.md)

Parent of this element.

***

### name

> **name**: `string` = `''`

Name of the element.

## Methods

### notifyPropertyChanged()

> **notifyPropertyChanged**(`propertyKey`, `value`): `void`

Function to call when a property in the element changed to notify listeners

#### Parameters

• **propertyKey**: `string`

• **value**: `any`

#### Returns

`void`

#### Inherited from

[`Watchable`](Watchable.md).[`notifyPropertyChanged`](Watchable.md#notifypropertychanged)

***

### subscribeToPropertiesChanges()

> **subscribeToPropertiesChanges**(`listener`): `void`

Function to subscribe to properties changes of the element

#### Parameters

• **listener**: `PropertiesListener`

#### Returns

`void`

#### Inherited from

[`Watchable`](Watchable.md).[`subscribeToPropertiesChanges`](Watchable.md#subscribetopropertieschanges)

***

### unsubscribeFromPropertiesChanges()

> **unsubscribeFromPropertiesChanges**(`listener`): `void`

function to unsubscribe from properties changes of the element

#### Parameters

• **listener**: `PropertiesListener`

#### Returns

`void`

#### Inherited from

[`Watchable`](Watchable.md).[`unsubscribeFromPropertiesChanges`](Watchable.md#unsubscribefrompropertieschanges)

***

### subscribeToPropertyChanged()

> **subscribeToPropertyChanged**(`property`, `listener`): `void`

function to subscribe to one property changed

#### Parameters

• **property**: `string`

• **listener**: `PropertyListener`

#### Returns

`void`

#### Inherited from

[`Watchable`](Watchable.md).[`subscribeToPropertyChanged`](Watchable.md#subscribetopropertychanged)

***

### unsubscribeFromPropertyChanged()

> **unsubscribeFromPropertyChanged**(`property`, `listener`): `void`

function to unsubscribe from one property changed

#### Parameters

• **property**: `string`

• **listener**: `PropertyListener`

#### Returns

`void`

#### Inherited from

[`Watchable`](Watchable.md).[`unsubscribeFromPropertyChanged`](Watchable.md#unsubscribefrompropertychanged)

***

### initialize()

> **initialize**(`configuration`?): `void`

Initialize default value of each property.

#### Parameters

• **configuration?**: `any`

: configuration

#### Returns

`void`

***

### dispose()

> **dispose**(): `void`

Dispose the element.

#### Returns

`void`

#### Overrides

[`Watchable`](Watchable.md).[`dispose`](Watchable.md#dispose)


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/