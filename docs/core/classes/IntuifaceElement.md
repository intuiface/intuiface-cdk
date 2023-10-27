# Class: IntuifaceElement

An `IntuifaceElement` represents the base of any kind of element that compose an Intuiface experience: asset, collection, interface asset, layer, scene, experience...

All this elements extends `IntuifaceElement` and use the appropriate decorator to make it usable in the experience, such as [`@Asset`](../README.md#asset) or [`@Collection`](../README.md#collection).

## Hierarchy

- [`Watchable`](Watchable.md)

  ↳ **`IntuifaceElement`**

  ↳↳ [`IntuifaceCollection`](IntuifaceCollection.md)

## Table of contents

### Properties

- [container](IntuifaceElement.md#container)
- [parent](IntuifaceElement.md#parent)
- [name](IntuifaceElement.md#name)

### Methods

- [notifyPropertyChanged](IntuifaceElement.md#notifypropertychanged)
- [subscribeToPropertiesChanges](IntuifaceElement.md#subscribetopropertieschanges)
- [unsubscribeFromPropertiesChanges](IntuifaceElement.md#unsubscribefrompropertieschanges)
- [subscribeToPropertyChanged](IntuifaceElement.md#subscribetopropertychanged)
- [unsubscribeFromPropertyChanged](IntuifaceElement.md#unsubscribefrompropertychanged)
- [initialize](IntuifaceElement.md#initialize)
- [dispose](IntuifaceElement.md#dispose)

## Properties

### container

• **container**: [`ElementContainer`](ElementContainer.md)

Container of this element

___

### parent

• **parent**: [`IntuifaceElement`](IntuifaceElement.md)

Parent of this element.

___

### name

• **name**: `string` = `''`

Name of the element.

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

[Watchable](Watchable.md).[notifyPropertyChanged](Watchable.md#notifypropertychanged)

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

[Watchable](Watchable.md).[subscribeToPropertiesChanges](Watchable.md#subscribetopropertieschanges)

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

[Watchable](Watchable.md).[unsubscribeFromPropertiesChanges](Watchable.md#unsubscribefrompropertieschanges)

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

[Watchable](Watchable.md).[subscribeToPropertyChanged](Watchable.md#subscribetopropertychanged)

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

[Watchable](Watchable.md).[unsubscribeFromPropertyChanged](Watchable.md#unsubscribefrompropertychanged)

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

___

### dispose

▸ **dispose**(): `void`

Dispose the element.

#### Returns

`void`

#### Overrides

[Watchable](Watchable.md).[dispose](Watchable.md#dispose)


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/