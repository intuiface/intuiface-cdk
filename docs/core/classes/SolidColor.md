# Class: SolidColor

Solid color type

## Hierarchy

- [`Color`](Color.md)

  ↳ **`SolidColor`**

## Table of contents

### Constructors

- [constructor](SolidColor.md#constructor)

### Methods

- [canConvertFrom](SolidColor.md#canconvertfrom)
- [convertFrom](SolidColor.md#convertfrom)
- [canConvertTo](SolidColor.md#canconvertto)
- [toString](SolidColor.md#tostring)
- [isGradient](SolidColor.md#isgradient)
- [equals](SolidColor.md#equals)
- [convertTo](SolidColor.md#convertto)

## Constructors

### constructor

• **new SolidColor**(`alpha`, `red`, `green`, `blue`, `format?`)

Constructor

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `alpha` | `string` | `undefined` |
| `red` | `string` | `undefined` |
| `green` | `string` | `undefined` |
| `blue` | `string` | `undefined` |
| `format` | `EColorFormat` | `EColorFormat.HexARGB` |

#### Overrides

Color.constructor

## Methods

### canConvertFrom

▸ `Static` **canConvertFrom**(`value`): `boolean`

Check if we can convert a value to a solid color

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

▸ `Static` **convertFrom**(`value`, `format?`): [`SolidColor`](SolidColor.md)

Convert a value to a solid color

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |
| `format?` | `EColorFormat` |

#### Returns

[`SolidColor`](SolidColor.md)

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

### toString

▸ **toString**(): `string`

Convert a solid color to a string

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

___

### equals

▸ **equals**(`color`): `boolean`

Function equals for the color type

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `color` | [`SolidColor`](SolidColor.md) | color to compare |

#### Returns

`boolean`

#### Overrides

[Color](Color.md).[equals](Color.md#equals)

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

#### Overrides

[Color](Color.md).[convertTo](Color.md#convertto)


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/