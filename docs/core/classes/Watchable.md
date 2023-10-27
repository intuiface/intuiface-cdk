# Class: Watchable

Class that allow watching property changes on inherinting instance

## Hierarchy

- **`Watchable`**

  ↳ [`IntuifaceElement`](IntuifaceElement.md)

  ↳ [`ElementContainer`](ElementContainer.md)

## Table of contents

### Methods

- [notifyPropertyChanged](Watchable.md#notifypropertychanged)
- [subscribeToPropertiesChanges](Watchable.md#subscribetopropertieschanges)
- [unsubscribeFromPropertiesChanges](Watchable.md#unsubscribefrompropertieschanges)
- [subscribeToPropertyChanged](Watchable.md#subscribetopropertychanged)
- [unsubscribeFromPropertyChanged](Watchable.md#unsubscribefrompropertychanged)
- [dispose](Watchable.md#dispose)

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

___

### dispose

▸ **dispose**(): `void`

Dispose watchable.

#### Returns

`void`
