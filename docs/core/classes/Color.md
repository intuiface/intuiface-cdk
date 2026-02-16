[**@intuiface/core**](../README.md)

***

# Abstract Class: Color

Class to type a property that can be a solid color or a gradient.

## Example

## Extended by

- [`SolidColor`](SolidColor.md)
- [`LinearGradient`](LinearGradient.md)
- [`RadialGradient`](RadialGradient.md)

## Implements

- [`IConvertibleType`](../interfaces/IConvertibleType.md)

## Methods

### canConvertFrom()

> `static` **canConvertFrom**(`value`): `boolean`

Check if we can convert a value to a color

#### Parameters

##### value

`unknown`

#### Returns

`boolean`

***

### convertFrom()

> `static` **convertFrom**(`value`): `Color`

Convert a value to a color

#### Parameters

##### value

`unknown`

#### Returns

`Color`

***

### toString()

> `abstract` **toString**(): `string`

Color to string method

#### Returns

`string`

#### Implementation of

[`IConvertibleType`](../interfaces/IConvertibleType.md).[`toString`](../interfaces/IConvertibleType.md#tostring)

***

### equals()

> `abstract` **equals**(`color`): `boolean`

Function equals for the color type

#### Parameters

##### color

`Color`

color to compare

#### Returns

`boolean`

***

### isGradient()

> `abstract` **isGradient**(): `boolean`

Is the color a gradient?

#### Returns

`boolean`

***

### canConvertTo()

> **canConvertTo**(`type`): `boolean`

Check if the color can be converted to a type

#### Parameters

##### type

`unknown`

#### Returns

`boolean`

#### Implementation of

[`IConvertibleType`](../interfaces/IConvertibleType.md).[`canConvertTo`](../interfaces/IConvertibleType.md#canconvertto)

***

### convertTo()

> **convertTo**(`type`): `unknown`

Function to convert a color to another type

#### Parameters

##### type

`unknown`

#### Returns

`unknown`

#### Implementation of

[`IConvertibleType`](../interfaces/IConvertibleType.md).[`convertTo`](../interfaces/IConvertibleType.md#convertto)


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/