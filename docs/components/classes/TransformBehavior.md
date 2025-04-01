[**@intuiface/components**](../README.md) • **Docs**

***

# Class: TransformBehavior

Behavior to apply a transformation.

## Properties

### x

> **x**: `number` = `0`

Position on X axis of the element.

***

### y

> **y**: `number` = `0`

Position on Y axis of the element.

***

### z

> **z**: `number` = `0`

Position on Z axis of the element.

***

### orientation

> **orientation**: `number` = `0`

Orientation of the element.

***

### width

> **width**: `number` = `300`

Width of the element.

***

### height

> **height**: `number` = `200`

Height of the element.

## Methods

### translateBy()

> **translateBy**(`x`, `y`, `configuration`): `void`

Action to translate the matrix.

#### Parameters

• **x**: `number`

translation on X axis

• **y**: `number`

translation on Y axis

• **configuration**: `unknown`

configuration of the animation

#### Returns

`void`

***

### translateTo()

> **translateTo**(`x`, `y`, `configuration`): `void`

Action to translate the matrix.

#### Parameters

• **x**: `number`

translation on X axis

• **y**: `number`

translation on Y axis

• **configuration**: `unknown`

configuration of the animation

#### Returns

`void`

***

### rotateBy()

> **rotateBy**(`orientation`, `configuration`): `void`

Action to rotate the matrix.

#### Parameters

• **orientation**: `number`

• **configuration**: `unknown`

configuration of the animation

#### Returns

`void`

***

### rotateTo()

> **rotateTo**(`orientation`, `configuration`): `void`

Action to rotate the matrix.

#### Parameters

• **orientation**: `number`

new orientation

• **configuration**: `unknown`

configuration of the animation

#### Returns

`void`

***

### resizeBy()

> **resizeBy**(`width`, `height`, `configuration`): `void`

Action to resize the element.

#### Parameters

• **width**: `number`

width to add

• **height**: `number`

height to add

• **configuration**: `unknown`

configuration of the animation

#### Returns

`void`

***

### resizeTo()

> **resizeTo**(`width`, `height`, `configuration`): `void`

Action to resize the element.

#### Parameters

• **width**: `number`

new width

• **height**: `number`

new height

• **configuration**: `unknown`

configuration of the animation

#### Returns

`void`

***

### scaleBy()

> **scaleBy**(`factor`, `configuration`): `void`

Action to scale the element.

#### Parameters

• **factor**: `number`

scale factor to apply

• **configuration**: `unknown`

configuration of the animation

#### Returns

`void`

***

### scaleTo()

> **scaleTo**(`factor`, `configuration`): `void`

Action to scale the element.

#### Parameters

• **factor**: `number`

scale factor to apply

• **configuration**: `unknown`

configuration of the animation

#### Returns

`void`

***

### translateRotateResizeTo()

> **translateRotateResizeTo**(`x`, `y`, `width`, `height`, `orientation`, `configuration`): `void`

Action to translate, rotate and resize the element.

#### Parameters

• **x**: `number`

translation on X axis

• **y**: `number`

translation on Y axis

• **width**: `number`

new width

• **height**: `number`

new height

• **orientation**: `number`

new orientation

• **configuration**: `unknown`

configuration of the animation

#### Returns

`void`


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/