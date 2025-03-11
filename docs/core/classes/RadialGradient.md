[**@intuiface/core**](../README.md) • **Docs**

***

# Class: RadialGradient

Class to use to describe a linear gradient.

## Example

## Extends

- [`Color`](Color.md)

## Constructors

### new RadialGradient()

> **new RadialGradient**(`originPoint`, `centerPoint`, `radiusX`, `radiusY`, `gradientPoints`): [`RadialGradient`](RadialGradient.md)

Constructor

#### Parameters

• **originPoint**: `string`

• **centerPoint**: `string`

• **radiusX**: `number`

• **radiusY**: `number`

• **gradientPoints**: `GradientPoint`[]

#### Returns

[`RadialGradient`](RadialGradient.md)

#### Overrides

`Color.constructor`

## Methods

### canConvertFrom()

> `static` **canConvertFrom**(`value`): `boolean`

Check if we can convert a value to a radial gradient

#### Parameters

• **value**: `unknown`

#### Returns

`boolean`

#### Overrides

[`Color`](Color.md).[`canConvertFrom`](Color.md#canconvertfrom)

***

### convertFrom()

> `static` **convertFrom**(`value`): [`RadialGradient`](RadialGradient.md)

Convert a value to a radial gradient

#### Parameters

• **value**: `unknown`

#### Returns

[`RadialGradient`](RadialGradient.md)

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

### convertTo()

> **convertTo**(`type`): `unknown`

Function to convert a color to another type

#### Parameters

• **type**: `unknown`

#### Returns

`unknown`

#### Inherited from

[`Color`](Color.md).[`convertTo`](Color.md#convertto)

***

### equals()

> **equals**(`color`): `boolean`

Function equals for the color type

#### Parameters

• **color**: [`RadialGradient`](RadialGradient.md)

color to compare

#### Returns

`boolean`

#### Overrides

[`Color`](Color.md).[`equals`](Color.md#equals)

***

### toString()

> **toString**(): `string`

Convert a radial gradient to a string

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


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/