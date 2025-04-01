[**@intuiface/components**](../README.md) • **Docs**

***

# Class: ToggleButtonBehavior

Behavior to manage a text.

## Extends

- `Watchable`

## Properties

### isChecked

> **isChecked**: `boolean` = `false`

Is Checked

***

### checkedColor

> **checkedColor**: `string` = `'#83D3F6FF'`

Checked color.

***

### logicGroupName

> **logicGroupName**: `string` = `null`

Logic Group Name

***

### allowToUncheck

> **allowToUncheck**: `boolean` = `false`

Allow to uncheck

***

### isMemberOfToggleSet

> **isMemberOfToggleSet**: `boolean` = `false`

Boolean to know if the toggle button is member of toggle set

## Methods

### raiseButtonChecked()

> **raiseButtonChecked**(): `void`

Trigger when button is checked

#### Returns

`void`

***

### raiseButtonUnchecked()

> **raiseButtonUnchecked**(): `void`

Trigger when button is unchecked

#### Returns

`void`

***

### check()

> **check**(): `void`

Action to check the button

#### Returns

`void`

***

### uncheck()

> **uncheck**(): `void`

Action to unckeck the button

#### Returns

`void`

***

### toggleCheckUncheck()

> **toggleCheckUncheck**(): `void`

Action to toggle the button.

#### Returns

`void`

***

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