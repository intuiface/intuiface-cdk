# Class: Color

Color type

## Implements

- `IConvertibleType`

## Table of contents

### Constructors

- [constructor](Color.md#constructor)

### Methods

- [convertFrom](Color.md#convertfrom)
- [canConvertFrom](Color.md#canconvertfrom)
- [rgba2hex](Color.md#rgba2hex)
- [toString](Color.md#tostring)
- [canConvertTo](Color.md#canconvertto)
- [convertTo](Color.md#convertto)

## Constructors

### constructor

• **new Color**(`alpha`, `red`, `green`, `blue`)

Constructor

#### Parameters

| Name | Type |
| :------ | :------ |
| `alpha` | `string` |
| `red` | `string` |
| `green` | `string` |
| `blue` | `string` |

## Methods

### convertFrom

▸ `Static` **convertFrom**(`value`): [`Color`](Color.md)

Convert a value to a color

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |

#### Returns

[`Color`](Color.md)

___

### canConvertFrom

▸ `Static` **canConvertFrom**(`value`): `boolean`

Check if we can convert value to Color

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |

#### Returns

`boolean`

___

### rgba2hex

▸ `Static` **rgba2hex**(`color`): `string`

Convert given rgba color to hexadecimal color.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `color` | `string` | color to converts |

#### Returns

`string`

___

### toString

▸ **toString**(): `string`

Convert a color to string

#### Returns

`string`

#### Implementation of

IConvertibleType.toString

___

### canConvertTo

▸ **canConvertTo**(`type`): `boolean`

Check if the type can be converted

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `unknown` |

#### Returns

`boolean`

#### Implementation of

IConvertibleType.canConvertTo

___

### convertTo

▸ **convertTo**(`type`): `unknown`

Function to convert a Color to another type

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `unknown` |

#### Returns

`unknown`

#### Implementation of

IConvertibleType.convertTo
