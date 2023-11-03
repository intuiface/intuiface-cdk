# Class: ElementContainer

Base classe for all Container

## Hierarchy

- [`Watchable`](Watchable.md)

  ↳ **`ElementContainer`**

## Table of contents

### Properties

- [top](ElementContainer.md#top)
- [topUnit](ElementContainer.md#topunit)
- [bottom](ElementContainer.md#bottom)
- [bottomUnit](ElementContainer.md#bottomunit)
- [left](ElementContainer.md#left)
- [leftUnit](ElementContainer.md#leftunit)
- [right](ElementContainer.md#right)
- [rightUnit](ElementContainer.md#rightunit)
- [zIndex](ElementContainer.md#zindex)
- [width](ElementContainer.md#width)
- [widthUnit](ElementContainer.md#widthunit)
- [height](ElementContainer.md#height)
- [heightUnit](ElementContainer.md#heightunit)
- [margin](ElementContainer.md#margin)
- [orientation](ElementContainer.md#orientation)
- [transform](ElementContainer.md#transform)
- [position](ElementContainer.md#position)
- [transition](ElementContainer.md#transition)
- [transformOrigin](ElementContainer.md#transformorigin)
- [opacity](ElementContainer.md#opacity)
- [blur](ElementContainer.md#blur)
- [sepia](ElementContainer.md#sepia)
- [hueRotation](ElementContainer.md#huerotation)
- [brightness](ElementContainer.md#brightness)
- [backfaceVisibility](ElementContainer.md#backfacevisibility)
- [itemShadow](ElementContainer.md#itemshadow)
- [isShown](ElementContainer.md#isshown)
- [isDisplayed](ElementContainer.md#isdisplayed)
- [isVisibleToInteractivity](ElementContainer.md#isvisibletointeractivity)

### Methods

- [notifyPropertyChanged](ElementContainer.md#notifypropertychanged)
- [subscribeToPropertiesChanges](ElementContainer.md#subscribetopropertieschanges)
- [unsubscribeFromPropertiesChanges](ElementContainer.md#unsubscribefrompropertieschanges)
- [subscribeToPropertyChanged](ElementContainer.md#subscribetopropertychanged)
- [unsubscribeFromPropertyChanged](ElementContainer.md#unsubscribefrompropertychanged)
- [dispose](ElementContainer.md#dispose)
- [setOpacity](ElementContainer.md#setopacity)
- [toggleVisibleToInteractivity](ElementContainer.md#togglevisibletointeractivity)
- [enableVisibleToInteractivity](ElementContainer.md#enablevisibletointeractivity)
- [disableVisibleToInteractivity](ElementContainer.md#disablevisibletointeractivity)

## Properties

### top

• **top**: `number`

Value of the CSS top property

___

### topUnit

• **topUnit**: `string` = `CssUnits.Pixel`

Unit for the CSS top property

___

### bottom

• **bottom**: `number`

Value of the CSS bottom property

___

### bottomUnit

• **bottomUnit**: `string` = `CssUnits.Pixel`

Unit for the CSS top property

___

### left

• **left**: `number`

Value of the CSS left property

___

### leftUnit

• **leftUnit**: `string` = `CssUnits.Pixel`

Unit for the CSS left property

___

### right

• **right**: `number`

Value of the CSS right property

___

### rightUnit

• **rightUnit**: `string` = `CssUnits.Pixel`

Unit for the CSS right property

___

### zIndex

• **zIndex**: `number`

Value of the CSS zIndex property

___

### width

• **width**: `number`

Value of the CSS width property

___

### widthUnit

• **widthUnit**: `string` = `CssUnits.Pixel`

Unit for the CSS width property

___

### height

• **height**: `number`

Value of the CSS height property

___

### heightUnit

• **heightUnit**: `string` = `CssUnits.Pixel`

Unit for the CSS height property

___

### margin

• **margin**: `string`

Value of the CSS margin property

___

### orientation

• **orientation**: `number`

Value for the orientation of this element

___

### transform

• **transform**: `any`

Value for the CSS transform property

___

### position

• **position**: `string` = `''`

Value of the CSS position property

___

### transition

• **transition**: `string` = `''`

Value for the CSS transition property

___

### transformOrigin

• **transformOrigin**: `string` = `'center'`

Value for the CSS transform origin property

___

### opacity

• **opacity**: `number` = `1`

Opacity.

___

### blur

• **blur**: `number` = `0`

Blur.

___

### sepia

• **sepia**: `number` = `0`

Sepia.

___

### hueRotation

• **hueRotation**: `number` = `0`

Hue Rotation.

___

### brightness

• **brightness**: `number` = `100`

Brightness.

___

### backfaceVisibility

• **backfaceVisibility**: `string` = `'visible'`

Backface visibility
Usefull for carousel container

___

### itemShadow

• **itemShadow**: `string` = `'unset'`

Item Shadow
Usefull for carousel container

___

### isShown

• **isShown**: `boolean` = `true`

Is Visible property of the current container.

___

### isDisplayed

• **isDisplayed**: `boolean` = `true`

Indicates whether or not the current container is displayed on the screen
Takes into account both isShown and isShownByInheritance properties

___

### isVisibleToInteractivity

• **isVisibleToInteractivity**: `boolean` = `true`

Is Visible to Interactivity

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

### dispose

▸ **dispose**(): `void`

Dispose watchable.

#### Returns

`void`

#### Inherited from

[Watchable](Watchable.md).[dispose](Watchable.md#dispose)

___

### setOpacity

▸ **setOpacity**(`opacity`): `void`

Action to set opacity.

#### Parameters

| Name | Type |
| :------ | :------ |
| `opacity` | `number` |

#### Returns

`void`

___

### toggleVisibleToInteractivity

▸ **toggleVisibleToInteractivity**(): `void`

Action to toggle the isVisibleToInteractivity property

#### Returns

`void`

___

### enableVisibleToInteractivity

▸ **enableVisibleToInteractivity**(): `void`

Function to enable the isVisibleToInteractivity property

#### Returns

`void`

___

### disableVisibleToInteractivity

▸ **disableVisibleToInteractivity**(): `void`

Function to disable the isVisibleToInteractivity property

#### Returns

`void`


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/