# Class: Color

Class to type a property that can be a solid color or a gradient.

**`Example`**

```ts
@Property({
    displayName: 'Background color',
    defaultValue: SolidColor.TransparentBlack, // the default value of the property
    type: Color
})
public backgroundColor: Color;
```

## Hierarchy

- **`Color`**

  ↳ [`SolidColor`](SolidColor.md)

  ↳ [`LinearGradient`](LinearGradient.md)

  ↳ [`RadialGradient`](RadialGradient.md)

## Implements

- [`IConvertibleType`](../interfaces/IConvertibleType.md)

## Table of contents

### Methods

- [canConvertFrom](Color.md#canconvertfrom)
- [convertFrom](Color.md#convertfrom)
- [toString](Color.md#tostring)
- [equals](Color.md#equals)
- [isGradient](Color.md#isgradient)
- [canConvertTo](Color.md#canconvertto)
- [convertTo](Color.md#convertto)

## Methods

### canConvertFrom

▸ `Static` **canConvertFrom**(`value`): `boolean`

Check if we can convert a value to a color

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |

#### Returns

`boolean`

___

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

### toString

▸ `Abstract` **toString**(): `string`

Color to string method

#### Returns

`string`

#### Implementation of

[IConvertibleType](../interfaces/IConvertibleType.md).[toString](../interfaces/IConvertibleType.md#tostring)

___

### equals

▸ `Abstract` **equals**(`color`): `boolean`

Function equals for the color type

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `color` | [`Color`](Color.md) | color to compare |

#### Returns

`boolean`

___

### isGradient

▸ `Abstract` **isGradient**(): `boolean`

Is the color a gradient?

#### Returns

`boolean`

___

### canConvertTo

▸ **canConvertTo**(`type`): `boolean`

Check if the color can be converted to a type

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

Function to convert a color to another type

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `unknown` |

#### Returns

`unknown`

#### Implementation of

[IConvertibleType](../interfaces/IConvertibleType.md).[convertTo](../interfaces/IConvertibleType.md#convertto)


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/