[**@intuiface/core**](../README.md) • **Docs**

***

# Class: SolidColor

Class to use to describe a solid color.

## Example

## Extends

- [`Color`](Color.md)

## Constructors

### new SolidColor()

> **new SolidColor**(`alpha`, `red`, `green`, `blue`, `format`): [`SolidColor`](SolidColor.md)

Constructor

#### Parameters

• **alpha**: `string`

• **red**: `string`

• **green**: `string`

• **blue**: `string`

• **format**: `EColorFormat` = `EColorFormat.HexARGB`

#### Returns

[`SolidColor`](SolidColor.md)

#### Overrides

`Color.constructor`

## Methods

### canConvertFrom()

> `static` **canConvertFrom**(`value`): `boolean`

Check if we can convert a value to a solid color

#### Parameters

• **value**: `unknown`

#### Returns

`boolean`

#### Overrides

[`Color`](Color.md).[`canConvertFrom`](Color.md#canconvertfrom)

***

### convertFrom()

> `static` **convertFrom**(`value`, `format`?): [`SolidColor`](SolidColor.md)

Convert a value to a solid color

#### Parameters

• **value**: `unknown`

• **format?**: `EColorFormat`

#### Returns

[`SolidColor`](SolidColor.md)

#### Overrides

[`Color`](Color.md).[`convertFrom`](Color.md#convertfrom)

***

### canConvertTo()

> **canConvertTo**(`type`): `boolean`

Check if the color can be converted to a type

#### Parameters

• **type**: `unknown`

#### Returns

`boolean`

#### Inherited from

[`Color`](Color.md).[`canConvertTo`](Color.md#canconvertto)

***

### toString()

> **toString**(): `string`

Convert a solid color to a string

#### Returns

`string`

#### Overrides

[`Color`](Color.md).[`toString`](Color.md#tostring)

***

### isGradient()

> **isGradient**(): `boolean`

Is the color a gradient?

#### Returns

`boolean`

#### Overrides

[`Color`](Color.md).[`isGradient`](Color.md#isgradient)

***

### equals()

> **equals**(`color`): `boolean`

Function equals for the color type

#### Parameters

• **color**: [`SolidColor`](SolidColor.md)

color to compare

#### Returns

`boolean`

#### Overrides

[`Color`](Color.md).[`equals`](Color.md#equals)

***

### convertTo()

> **convertTo**(`type`): `unknown`

Function to convert a color to another type

#### Parameters

• **type**: `unknown`

#### Returns

`unknown`

#### Overrides

[`Color`](Color.md).[`convertTo`](Color.md#convertto)


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/