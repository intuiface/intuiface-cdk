[**@intuiface/core**](../README.md)

***

# Class: ElementContainer

Base class for all Container

## Extends

- [`Watchable`](Watchable.md)

## Properties

### top

> **top**: `number`

Value of the CSS top property

***

### topUnit

> **topUnit**: `string` = `CssUnits.Pixel`

Unit for the CSS top property

***

### bottom

> **bottom**: `number`

Value of the CSS bottom property

***

### bottomUnit

> **bottomUnit**: `string` = `CssUnits.Pixel`

Unit for the CSS top property

***

### left

> **left**: `number`

Value of the CSS left property

***

### leftUnit

> **leftUnit**: `string` = `CssUnits.Pixel`

Unit for the CSS left property

***

### right

> **right**: `number`

Value of the CSS right property

***

### rightUnit

> **rightUnit**: `string` = `CssUnits.Pixel`

Unit for the CSS right property

***

### zIndex

> **zIndex**: `number`

Value of the CSS zIndex property

***

### width

> **width**: `number`

Value of the CSS width property

***

### widthUnit

> **widthUnit**: `string` = `CssUnits.Pixel`

Unit for the CSS width property

***

### height

> **height**: `number`

Value of the CSS height property

***

### heightUnit

> **heightUnit**: `string` = `CssUnits.Pixel`

Unit for the CSS height property

***

### margin

> **margin**: `string`

Value of the CSS margin property

***

### orientation

> **orientation**: `number`

Value for the orientation of this element

***

### transform

> **transform**: `any`

Value for the CSS transform property

***

### position

> **position**: `string` = `''`

Value of the CSS position property

***

### transition

> **transition**: `string` = `''`

Value for the CSS transition property

***

### transformOrigin

> **transformOrigin**: `string` = `'center'`

Value for the CSS transform origin property

***

### opacity

> **opacity**: `number` = `1`

Opacity.

***

### blur

> **blur**: `number` = `0`

Blur.

***

### sepia

> **sepia**: `number` = `0`

Sepia.

***

### hueRotation

> **hueRotation**: `number` = `0`

Hue Rotation.

***

### brightness

> **brightness**: `number` = `100`

Brightness.

***

### backfaceVisibility

> **backfaceVisibility**: `string` = `'visible'`

Backface visibility
Useful for carousel container

***

### itemShadow

> **itemShadow**: `string` = `'unset'`

Item Shadow
Useful for carousel container

***

### isShown

> **isShown**: `boolean` = `true`

Is Visible property of the current container.

***

### isDisplayed

> **isDisplayed**: `boolean` = `true`

Indicates whether or not the current container is displayed on the screen
Takes into account both isShown and isShownByInheritance properties

***

### isVisibleToInteractivity

> **isVisibleToInteractivity**: `boolean` = `true`

Is Visible to Interactivity

## Methods

### notifyPropertyChanged()

> **notifyPropertyChanged**(`propertyKey`, `value`): `void`

Function to call when a property in the element changed to notify listeners

#### Parameters

##### propertyKey

`string`

##### value

`any`

#### Returns

`void`

#### Inherited from

[`Watchable`](Watchable.md).[`notifyPropertyChanged`](Watchable.md#notifypropertychanged)

***

### subscribeToPropertiesChanges()

> **subscribeToPropertiesChanges**(`listener`): `void`

Function to subscribe to properties changes of the element

#### Parameters

##### listener

`PropertiesListener`

#### Returns

`void`

#### Inherited from

[`Watchable`](Watchable.md).[`subscribeToPropertiesChanges`](Watchable.md#subscribetopropertieschanges)

***

### unsubscribeFromPropertiesChanges()

> **unsubscribeFromPropertiesChanges**(`listener`): `void`

function to unsubscribe from properties changes of the element

#### Parameters

##### listener

`PropertiesListener`

#### Returns

`void`

#### Inherited from

[`Watchable`](Watchable.md).[`unsubscribeFromPropertiesChanges`](Watchable.md#unsubscribefrompropertieschanges)

***

### subscribeToPropertyChanged()

> **subscribeToPropertyChanged**(`property`, `listener`): `void`

function to subscribe to one property changed

#### Parameters

##### property

`string`

##### listener

`PropertyListener`

#### Returns

`void`

#### Inherited from

[`Watchable`](Watchable.md).[`subscribeToPropertyChanged`](Watchable.md#subscribetopropertychanged)

***

### unsubscribeFromPropertyChanged()

> **unsubscribeFromPropertyChanged**(`property`, `listener`): `void`

function to unsubscribe from one property changed

#### Parameters

##### property

`string`

##### listener

`PropertyListener`

#### Returns

`void`

#### Inherited from

[`Watchable`](Watchable.md).[`unsubscribeFromPropertyChanged`](Watchable.md#unsubscribefrompropertychanged)

***

### dispose()

> **dispose**(): `void`

Dispose watchable.

#### Returns

`void`

#### Inherited from

[`Watchable`](Watchable.md).[`dispose`](Watchable.md#dispose)

***

### setOpacity()

> **setOpacity**(`opacity`): `void`

Action to set opacity.

#### Parameters

##### opacity

`number`

#### Returns

`void`

***

### toggleVisibleToInteractivity()

> **toggleVisibleToInteractivity**(): `void`

Action to toggle the isVisibleToInteractivity property

#### Returns

`void`

***

### enableVisibleToInteractivity()

> **enableVisibleToInteractivity**(): `void`

Function to enable the isVisibleToInteractivity property

#### Returns

`void`

***

### disableVisibleToInteractivity()

> **disableVisibleToInteractivity**(): `void`

Function to disable the isVisibleToInteractivity property

#### Returns

`void`


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/