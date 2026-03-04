[**@intuiface/core**](../README.md)

***

# Class: Resource

Class to use when a property is using a resource from an experience.

## Example

## Implements

- [`IConvertibleType`](../interfaces/IConvertibleType.md)

## Methods

### convertFrom()

> `static` **convertFrom**(`value`, `propertyOwner?`): `Resource`

Convert a value to a Resource

#### Parameters

##### value

`string`

value to convert

##### propertyOwner?

`any`

#### Returns

`Resource`

***

### canConvertFrom()

> `static` **canConvertFrom**(`value`): `boolean`

Check if we can convert value to Resource

#### Parameters

##### value

`string`

value to convert

#### Returns

`boolean`

***

### toString()

> **toString**(): `string`

Transform resource to string

#### Returns

`string`

#### Implementation of

[`IConvertibleType`](../interfaces/IConvertibleType.md).[`toString`](../interfaces/IConvertibleType.md#tostring)

***

### canConvertTo()

> **canConvertTo**(`type`): `boolean`

Check if the type can be converted

#### Parameters

##### type

`unknown`

targeted type

#### Returns

`boolean`

#### Implementation of

[`IConvertibleType`](../interfaces/IConvertibleType.md).[`canConvertTo`](../interfaces/IConvertibleType.md#canconvertto)

***

### convertTo()

> **convertTo**(`type`): `unknown`

Function to convert a Resource to another type

#### Parameters

##### type

`unknown`

targeted type

#### Returns

`unknown`

#### Implementation of

[`IConvertibleType`](../interfaces/IConvertibleType.md).[`convertTo`](../interfaces/IConvertibleType.md#convertto)


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/