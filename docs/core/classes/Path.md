[**@intuiface/core**](../README.md)

***

# Class: Path

Class to use to describe any king of path that can be used as URL

## Example

## Implements

- [`IConvertibleType`](../interfaces/IConvertibleType.md)

## Methods

### convertFrom()

> `static` **convertFrom**(`value`): `Path`

Convert a value to a Path

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | - |

#### Returns

`Path`

***

### canConvertFrom()

> `static` **canConvertFrom**(`value`): `boolean`

Check if we can convert value to Path

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | - |

#### Returns

`boolean`

***

### toString()

> **toString**(): `string`

Transform url to string

#### Returns

`string`

#### Implementation of

[`IConvertibleType`](../interfaces/IConvertibleType.md).[`toString`](../interfaces/IConvertibleType.md#tostring)

***

### canConvertTo()

> **canConvertTo**(`type`): `boolean`

Check if the type can be converted

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `unknown` | - |

#### Returns

`boolean`

#### Implementation of

[`IConvertibleType`](../interfaces/IConvertibleType.md).[`canConvertTo`](../interfaces/IConvertibleType.md#canconvertto)

***

### convertTo()

> **convertTo**(`type`): `unknown`

Function to convert a Path to another type

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `unknown` | - |

#### Returns

`unknown`

#### Implementation of

[`IConvertibleType`](../interfaces/IConvertibleType.md).[`convertTo`](../interfaces/IConvertibleType.md#convertto)


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/