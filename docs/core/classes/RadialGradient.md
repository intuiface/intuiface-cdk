# Class: RadialGradient

Class to use to describe a linear gradient.

**`Example`**

```ts
@Property({
    displayName: 'Background color',
    type: RadialGradient
})
public backgroundColor: RadialGradient;
```

## Hierarchy

- [`Color`](Color.md)

  ↳ **`RadialGradient`**

## Table of contents

### Constructors

- [constructor](RadialGradient.md#constructor)

### Methods

- [canConvertFrom](RadialGradient.md#canconvertfrom)
- [convertFrom](RadialGradient.md#convertfrom)
- [canConvertTo](RadialGradient.md#canconvertto)
- [convertTo](RadialGradient.md#convertto)
- [equals](RadialGradient.md#equals)
- [toString](RadialGradient.md#tostring)
- [isGradient](RadialGradient.md#isgradient)

## Constructors

### constructor

• **new RadialGradient**(`originPoint`, `centerPoint`, `radiusX`, `radiusY`, `gradientPoints`)

Constructor

#### Parameters

| Name | Type |
| :------ | :------ |
| `originPoint` | `string` |
| `centerPoint` | `string` |
| `radiusX` | `number` |
| `radiusY` | `number` |
| `gradientPoints` | `GradientPoint`[] |

#### Overrides

Color.constructor

## Methods

### canConvertFrom

▸ `Static` **canConvertFrom**(`value`): `boolean`

Check if we can convert a value to a radial gradient

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |

#### Returns

`boolean`

#### Overrides

[Color](Color.md).[canConvertFrom](Color.md#canconvertfrom)

___

### convertFrom

▸ `Static` **convertFrom**(`value`): [`RadialGradient`](RadialGradient.md)

Convert a value to a radial gradient

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |

#### Returns

[`RadialGradient`](RadialGradient.md)

#### Overrides

[Color](Color.md).[convertFrom](Color.md#convertfrom)

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

#### Inherited from

[Color](Color.md).[canConvertTo](Color.md#canconvertto)

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

#### Inherited from

[Color](Color.md).[convertTo](Color.md#convertto)

___

### equals

▸ **equals**(`color`): `boolean`

Function equals for the color type

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `color` | [`RadialGradient`](RadialGradient.md) | color to compare |

#### Returns

`boolean`

#### Overrides

[Color](Color.md).[equals](Color.md#equals)

___

### toString

▸ **toString**(): `string`

Convert a radial gradient to a string

#### Returns

`string`

#### Overrides

[Color](Color.md).[toString](Color.md#tostring)

___

### isGradient

▸ **isGradient**(): `boolean`

Is the color a gradient?

#### Returns

`boolean`

#### Overrides

[Color](Color.md).[isGradient](Color.md#isgradient)


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/