# Class: ToggleButtonBehavior

Behavior to manage a text.

## Hierarchy

- `Watchable`

  ↳ **`ToggleButtonBehavior`**

## Table of contents

### Properties

- [isChecked](ToggleButtonBehavior.md#ischecked)
- [checkedColor](ToggleButtonBehavior.md#checkedcolor)
- [logicGroupName](ToggleButtonBehavior.md#logicgroupname)
- [allowToUncheck](ToggleButtonBehavior.md#allowtouncheck)
- [isMemberOfToggleSet](ToggleButtonBehavior.md#ismemberoftoggleset)

### Methods

- [raiseButtonChecked](ToggleButtonBehavior.md#raisebuttonchecked)
- [raiseButtonUnchecked](ToggleButtonBehavior.md#raisebuttonunchecked)
- [check](ToggleButtonBehavior.md#check)
- [uncheck](ToggleButtonBehavior.md#uncheck)
- [toggleCheckUncheck](ToggleButtonBehavior.md#togglecheckuncheck)
- [notifyPropertyChanged](ToggleButtonBehavior.md#notifypropertychanged)
- [subscribeToPropertiesChanges](ToggleButtonBehavior.md#subscribetopropertieschanges)
- [unsubscribeFromPropertiesChanges](ToggleButtonBehavior.md#unsubscribefrompropertieschanges)
- [subscribeToPropertyChanged](ToggleButtonBehavior.md#subscribetopropertychanged)
- [unsubscribeFromPropertyChanged](ToggleButtonBehavior.md#unsubscribefrompropertychanged)
- [dispose](ToggleButtonBehavior.md#dispose)

## Properties

### isChecked

• **isChecked**: `boolean` = `false`

Is Checked

___

### checkedColor

• **checkedColor**: `string` = `'#83D3F6FF'`

Checked color.

___

### logicGroupName

• **logicGroupName**: `string` = `null`

Logic Group Name

___

### allowToUncheck

• **allowToUncheck**: `boolean` = `false`

Allow to uncheck

___

### isMemberOfToggleSet

• **isMemberOfToggleSet**: `boolean` = `false`

Boolean to know if the toggle button is member of toggle set

## Methods

### raiseButtonChecked

▸ **raiseButtonChecked**(): `void`

Trigger when button is checked

#### Returns

`void`

___

### raiseButtonUnchecked

▸ **raiseButtonUnchecked**(): `void`

Trigger when button is unchecked

#### Returns

`void`

___

### check

▸ **check**(): `void`

Action to check the button

#### Returns

`void`

___

### uncheck

▸ **uncheck**(): `void`

Action to unckeck the button

#### Returns

`void`

___

### toggleCheckUncheck

▸ **toggleCheckUncheck**(): `void`

Action to toggle the button.

#### Returns

`void`

___

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


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/