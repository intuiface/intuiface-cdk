[**@intuiface/core**](../README.md)

***

# Class: Font

Class to use as type of property using font.

## Example

Note: We use the `Font` class as `type`, but the generic interface `Typeface` is used as type of the `titleFont` field.

## Implements

- [`Typeface`](../interfaces/Typeface.md)
- [`IConvertibleType`](../interfaces/IConvertibleType.md)

## Constructors

### Constructor

> **new Font**(`family`, `stretch`, `weight`, `style`): `Font`

Constructor

#### Parameters

##### family

`string`

Family of the font

##### stretch

`string`

Stretch of the font

##### weight

`string`

Weight of the font

##### style

`string`

Style of the font

#### Returns

`Font`

#### Examples

```ts
new Font('Arial', 'normal', 'normal', 'normal');
```

```ts
new Font('Arial', 'narrow', 'bold', 'italic');
```

## Properties

### family

> **family**: `string`

Family of the font

#### Implementation of

[`Typeface`](../interfaces/Typeface.md).[`family`](../interfaces/Typeface.md#family)

***

### stretch

> **stretch**: `string`

Stretch of the font

#### Implementation of

[`Typeface`](../interfaces/Typeface.md).[`stretch`](../interfaces/Typeface.md#stretch)

***

### weight

> **weight**: `string`

Weight of the font

#### Implementation of

[`Typeface`](../interfaces/Typeface.md).[`weight`](../interfaces/Typeface.md#weight)

***

### style

> **style**: `string`

Style of the font

#### Implementation of

[`Typeface`](../interfaces/Typeface.md).[`style`](../interfaces/Typeface.md#style)

## Methods

### convertFrom()

> `static` **convertFrom**(`value`): `Font`

Convert a value to a font

#### Parameters

##### value

`any`

#### Returns

`Font`

***

### canConvertFrom()

> `static` **canConvertFrom**(`value`): `boolean`

Check if we can convert value to Font

#### Parameters

##### value

`any`

#### Returns

`boolean`

***

### canConvertTo()

> **canConvertTo**(`type`): `boolean`

Check if the type can be converted

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

Function to convert a Font to another type

#### Parameters

##### type

`unknown`

#### Returns

`unknown`

#### Implementation of

[`IConvertibleType`](../interfaces/IConvertibleType.md).[`convertTo`](../interfaces/IConvertibleType.md#convertto)

***

### toString()

> **toString**(): `string`

Convert the font to string

#### Returns

`string`

#### Implementation of

[`IConvertibleType`](../interfaces/IConvertibleType.md).[`toString`](../interfaces/IConvertibleType.md#tostring)


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/