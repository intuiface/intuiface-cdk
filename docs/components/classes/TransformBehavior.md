# Class: TransformBehavior

Behavior to apply a transformation.

## Table of contents

### Properties

- [x](TransformBehavior.md#x)
- [y](TransformBehavior.md#y)
- [z](TransformBehavior.md#z)
- [orientation](TransformBehavior.md#orientation)
- [width](TransformBehavior.md#width)
- [height](TransformBehavior.md#height)

### Methods

- [translateBy](TransformBehavior.md#translateby)
- [translateTo](TransformBehavior.md#translateto)
- [rotateBy](TransformBehavior.md#rotateby)
- [rotateTo](TransformBehavior.md#rotateto)
- [resizeBy](TransformBehavior.md#resizeby)
- [resizeTo](TransformBehavior.md#resizeto)
- [scaleBy](TransformBehavior.md#scaleby)
- [scaleTo](TransformBehavior.md#scaleto)
- [translateRotateResizeTo](TransformBehavior.md#translaterotateresizeto)

## Properties

### x

• **x**: `number` = `0`

Position on X axis of the element.

___

### y

• **y**: `number` = `0`

Position on Y axis of the element.

___

### z

• **z**: `number` = `0`

Position on Z axis of the element.

___

### orientation

• **orientation**: `number` = `0`

Orientation of the element.

___

### width

• **width**: `number` = `300`

Width of the element.

___

### height

• **height**: `number` = `200`

Height of the element.

## Methods

### translateBy

▸ **translateBy**(`x`, `y`, `configuration`): `void`

Action to translate the matrix.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | translation on X axis |
| `y` | `number` | translation on Y axis |
| `configuration` | `unknown` | configuration of the animation |

#### Returns

`void`

___

### translateTo

▸ **translateTo**(`x`, `y`, `configuration`): `void`

Action to translate the matrix.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | translation on X axis |
| `y` | `number` | translation on Y axis |
| `configuration` | `unknown` | configuration of the animation |

#### Returns

`void`

___

### rotateBy

▸ **rotateBy**(`orientation`, `configuration`): `void`

Action to rotate the matrix.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orientation` | `number` | - |
| `configuration` | `unknown` | configuration of the animation |

#### Returns

`void`

___

### rotateTo

▸ **rotateTo**(`orientation`, `configuration`): `void`

Action to rotate the matrix.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `orientation` | `number` | new orientation |
| `configuration` | `unknown` | configuration of the animation |

#### Returns

`void`

___

### resizeBy

▸ **resizeBy**(`width`, `height`, `configuration`): `void`

Action to resize the element.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `width` | `number` | width to add |
| `height` | `number` | height to add |
| `configuration` | `unknown` | configuration of the animation |

#### Returns

`void`

___

### resizeTo

▸ **resizeTo**(`width`, `height`, `configuration`): `void`

Action to resize the element.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `width` | `number` | new width |
| `height` | `number` | new height |
| `configuration` | `unknown` | configuration of the animation |

#### Returns

`void`

___

### scaleBy

▸ **scaleBy**(`factor`, `configuration`): `void`

Action to scale the element.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `factor` | `number` | scale factor to apply |
| `configuration` | `unknown` | configuration of the animation |

#### Returns

`void`

___

### scaleTo

▸ **scaleTo**(`factor`, `configuration`): `void`

Action to scale the element.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `factor` | `number` | scale factor to apply |
| `configuration` | `unknown` | configuration of the animation |

#### Returns

`void`

___

### translateRotateResizeTo

▸ **translateRotateResizeTo**(`x`, `y`, `width`, `height`, `orientation`, `configuration`): `void`

Action to translate, rotate and resize the element.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `x` | `number` | translation on X axis |
| `y` | `number` | translation on Y axis |
| `width` | `number` | new width |
| `height` | `number` | new height |
| `orientation` | `number` | new orientation |
| `configuration` | `unknown` | configuration of the animation |

#### Returns

`void`


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/