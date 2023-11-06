# Class: LinearGradient

Linear gradient type

## Hierarchy

- [`Color`](Color.md)

  ↳ **`LinearGradient`**

## Table of contents

### Constructors

- [constructor](LinearGradient.md#constructor)

### Methods

- [canConvertFrom](LinearGradient.md#canconvertfrom)
- [convertFrom](LinearGradient.md#convertfrom)
- [canConvertTo](LinearGradient.md#canconvertto)
- [convertTo](LinearGradient.md#convertto)
- [equals](LinearGradient.md#equals)
- [toString](LinearGradient.md#tostring)
- [isGradient](LinearGradient.md#isgradient)

## Constructors

### constructor

• **new LinearGradient**(`angle`, `startPoint`, `endPoint`, `gradientPoints`)

Constructor

#### Parameters

| Name | Type |
| :------ | :------ |
| `angle` | `number` |
| `startPoint` | `string` |
| `endPoint` | `string` |
| `gradientPoints` | `GradientPoint`[] |

#### Overrides

Color.constructor

## Methods

### canConvertFrom

▸ `Static` **canConvertFrom**(`value`): `boolean`

Check if we can convert a value to a linear gradient

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |

#### Returns

`boolean`

#### Overrides

[Color](Color.md).[canConvertFrom](Color.md#canconvertfrom)

___

### convertFrom

▸ `Static` **convertFrom**(`value`): [`LinearGradient`](LinearGradient.md)

Convert a value to a linear gradient

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |

#### Returns

[`LinearGradient`](LinearGradient.md)

#### Overrides

[Color](Color.md).[convertFrom](Color.md#convertfrom)

___

### canConvertTo

▸ **canConvertTo**(`type`): `boolean`

Check if the color can be converted to a type

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `unknown` |

#### Returns

`boolean`

#### Inherited from

[Color](Color.md).[canConvertTo](Color.md#canconvertto)

___

### convertTo

▸ **convertTo**(`type`): `unknown`

Function to convert a color to another type

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `unknown` |

#### Returns

`unknown`

#### Inherited from

[Color](Color.md).[convertTo](Color.md#convertto)

___

### equals

▸ **equals**(`color`): `boolean`

Function equals for the color type

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `color` | [`LinearGradient`](LinearGradient.md) | color to compare |

#### Returns

`boolean`

#### Overrides

[Color](Color.md).[equals](Color.md#equals)

___

### toString

▸ **toString**(): `string`

Convert a linear gradient to a string

#### Returns

`string`

#### Overrides

[Color](Color.md).[toString](Color.md#tostring)

___

### isGradient

▸ **isGradient**(): `boolean`

Is the color a gradient?

#### Returns

`boolean`

#### Overrides

[Color](Color.md).[isGradient](Color.md#isgradient)


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/