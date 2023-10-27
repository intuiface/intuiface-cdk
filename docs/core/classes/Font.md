# Class: Font

Font type

## Implements

- [`IFont`](../interfaces/IFont.md)
- `IConvertibleType`

## Table of contents

### Constructors

- [constructor](Font.md#constructor)

### Methods

- [convertFrom](Font.md#convertfrom)
- [canConvertFrom](Font.md#canconvertfrom)
- [canConvertTo](Font.md#canconvertto)
- [convertTo](Font.md#convertto)
- [toString](Font.md#tostring)

## Constructors

### constructor

• **new Font**(`family`, `stretch`, `weight`, `style`)

Constructor

#### Parameters

| Name | Type |
| :------ | :------ |
| `family` | `string` |
| `stretch` | `string` |
| `weight` | `string` |
| `style` | `string` |

## Methods

### convertFrom

▸ `Static` **convertFrom**(`value`): [`Font`](Font.md)

Convert a value to a font

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

[`Font`](Font.md)

___

### canConvertFrom

▸ `Static` **canConvertFrom**(`value`): `boolean`

Check if we can convert value to Font

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |

#### Returns

`boolean`

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

Function to convert a Font to another type

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `unknown` |

#### Returns

`unknown`

#### Implementation of

IConvertibleType.convertTo

___

### toString

▸ **toString**(): `string`

Convert the font to string

#### Returns

`string`

#### Implementation of

IConvertibleType.toString
