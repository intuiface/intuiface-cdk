# Class: Color

Class to use to describe a color.

**`Example`**

```ts
@Property({
    displayName: 'Background color',
    defaultValue: Color.TransparentBlack, // the default value of the property
    type: Color
})
public backgroundColor: Color;
```

## Implements

- [`IConvertibleType`](../interfaces/IConvertibleType.md)

## Table of contents

### Constructors

- [constructor](Color.md#constructor)

### Properties

- [Black](Color.md#black)
- [TransparentBlack](Color.md#transparentblack)

### Methods

- [convertFrom](Color.md#convertfrom)
- [canConvertFrom](Color.md#canconvertfrom)
- [rgba2hex](Color.md#rgba2hex)
- [toString](Color.md#tostring)
- [canConvertTo](Color.md#canconvertto)
- [convertTo](Color.md#convertto)

## Constructors

### constructor

• **new Color**(`alpha`, `red`, `green`, `blue`)

Constructor

#### Parameters

| Name | Type |
| :------ | :------ |
| `alpha` | `string` |
| `red` | `string` |
| `green` | `string` |
| `blue` | `string` |

## Properties

### Black

▪ `Static` `Readonly` **Black**: [`Color`](Color.md)

Color instance of black

___

### TransparentBlack

▪ `Static` `Readonly` **TransparentBlack**: [`Color`](Color.md)

Color instance of transparent

## Methods

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

### canConvertFrom

▸ `Static` **canConvertFrom**(`value`): `boolean`

Check if we can convert value to Color

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |

#### Returns

`boolean`

___

### rgba2hex

▸ `Static` **rgba2hex**(`color`): `string`

Convert given rgba color to hexadecimal color.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `color` | `string` | color to converts |

#### Returns

`string`

___

### toString

▸ **toString**(): `string`

Convert a color to string

#### Returns

`string`

#### Implementation of

[IConvertibleType](../interfaces/IConvertibleType.md).[toString](../interfaces/IConvertibleType.md#tostring)

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

Function to convert a Color to another type

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