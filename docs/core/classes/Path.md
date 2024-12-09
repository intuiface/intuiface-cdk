[**@intuiface/core**](../README.md) • **Docs**

***

# Class: Path

Class to use to describe any king of path that can be used as URL

## Example

## Implements

- [`IConvertibleType`](../interfaces/IConvertibleType.md)

## Methods

### convertFrom()

> `static` **convertFrom**(`value`): [`Path`](Path.md)

Convert a value to a Path

#### Parameters

• **value**: `string`

#### Returns

[`Path`](Path.md)

***

### canConvertFrom()

> `static` **canConvertFrom**(`value`): `boolean`

Check if we can convert value to Path

#### Parameters

• **value**: `string`

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

• **type**: `unknown`

#### Returns

`boolean`

#### Implementation of

[`IConvertibleType`](../interfaces/IConvertibleType.md).[`canConvertTo`](../interfaces/IConvertibleType.md#canconvertto)

***

### convertTo()

> **convertTo**(`type`): `unknown`

Function to convert a Path to another type

#### Parameters

• **type**: `unknown`

#### Returns

`unknown`

#### Implementation of

[`IConvertibleType`](../interfaces/IConvertibleType.md).[`convertTo`](../interfaces/IConvertibleType.md#convertto)


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/