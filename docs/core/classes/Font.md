# Class: Font

Class to use as type of property using font.

**`Example`**

```ts
@Property({
    displayName: 'Title font',
    description: 'Font of the title.',
    defaultValue: null,
    type: Font
})
public titleFont: Typeface;
```
Note: We use the `Font` class as `type`, but the generic interface `Typeface` is used as type of the `titleFont` field.

## Implements

- [`Typeface`](../interfaces/Typeface.md)
- [`IConvertibleType`](../interfaces/IConvertibleType.md)

## Table of contents

### Constructors

- [constructor](Font.md#constructor)

### Properties

- [family](Font.md#family)
- [stretch](Font.md#stretch)
- [weight](Font.md#weight)
- [style](Font.md#style)

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

| Name | Type | Description |
| :------ | :------ | :------ |
| `family` | `string` | Family of the font |
| `stretch` | `string` | Stretch of the font |
| `weight` | `string` | Weight of the font |
| `style` | `string` | Style of the font |

**`Example`**

```ts
new Font('Arial', 'normal', 'normal', 'normal');
```

**`Example`**

```ts
new Font('Arial', 'narrow', 'bold', 'italic');
```

## Properties

### family

• **family**: `string`

Family of the font

#### Implementation of

[Typeface](../interfaces/Typeface.md).[family](../interfaces/Typeface.md#family)

___

### stretch

• **stretch**: `string`

Stretch of the font

#### Implementation of

[Typeface](../interfaces/Typeface.md).[stretch](../interfaces/Typeface.md#stretch)

___

### weight

• **weight**: `string`

Weight of the font

#### Implementation of

[Typeface](../interfaces/Typeface.md).[weight](../interfaces/Typeface.md#weight)

___

### style

• **style**: `string`

Style of the font

#### Implementation of

[Typeface](../interfaces/Typeface.md).[style](../interfaces/Typeface.md#style)

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

[IConvertibleType](../interfaces/IConvertibleType.md).[canConvertTo](../interfaces/IConvertibleType.md#canconvertto)

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

[IConvertibleType](../interfaces/IConvertibleType.md).[convertTo](../interfaces/IConvertibleType.md#convertto)

___

### toString

▸ **toString**(): `string`

Convert the font to string

#### Returns

`string`

#### Implementation of

[IConvertibleType](../interfaces/IConvertibleType.md).[toString](../interfaces/IConvertibleType.md#tostring)


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/