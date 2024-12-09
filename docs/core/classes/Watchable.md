[**@intuiface/core**](../README.md) • **Docs**

***

# Class: Watchable

Class that allow watching property changes on inheriting instance

## Extended by

- [`IntuifaceElement`](IntuifaceElement.md)
- [`ElementContainer`](ElementContainer.md)

## Methods

### notifyPropertyChanged()

> **notifyPropertyChanged**(`propertyKey`, `value`): `void`

Function to call when a property in the element changed to notify listeners

#### Parameters

• **propertyKey**: `string`

• **value**: `any`

#### Returns

`void`

***

### subscribeToPropertiesChanges()

> **subscribeToPropertiesChanges**(`listener`): `void`

Function to subscribe to properties changes of the element

#### Parameters

• **listener**: `PropertiesListener`

#### Returns

`void`

***

### unsubscribeFromPropertiesChanges()

> **unsubscribeFromPropertiesChanges**(`listener`): `void`

function to unsubscribe from properties changes of the element

#### Parameters

• **listener**: `PropertiesListener`

#### Returns

`void`

***

### subscribeToPropertyChanged()

> **subscribeToPropertyChanged**(`property`, `listener`): `void`

function to subscribe to one property changed

#### Parameters

• **property**: `string`

• **listener**: `PropertyListener`

#### Returns

`void`

***

### unsubscribeFromPropertyChanged()

> **unsubscribeFromPropertyChanged**(`property`, `listener`): `void`

function to unsubscribe from one property changed

#### Parameters

• **property**: `string`

• **listener**: `PropertyListener`

#### Returns

`void`

***

### dispose()

> **dispose**(): `void`

Dispose watchable.

#### Returns

`void`


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/