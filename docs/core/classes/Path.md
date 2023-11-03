# Class: Path

Class to use to describe any king of path that can be used as URL

**`Example`**

```ts
@Property({
    displayName: 'Source',
    description: 'Source of the data.',
    defaultValue: null,
    type: Path
})
public source: Path;
```

## Implements

- [`IConvertibleType`](../interfaces/IConvertibleType.md)

## Table of contents

### Methods

- [convertFrom](Path.md#convertfrom)
- [canConvertFrom](Path.md#canconvertfrom)
- [toString](Path.md#tostring)
- [canConvertTo](Path.md#canconvertto)
- [convertTo](Path.md#convertto)

## Methods

### convertFrom

▸ `Static` **convertFrom**(`value`): [`Path`](Path.md)

Convert a value to a Path

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

[`Path`](Path.md)

___

### canConvertFrom

▸ `Static` **canConvertFrom**(`value`): `boolean`

Check if we can convert value to Path

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

`boolean`

___

### toString

▸ **toString**(): `string`

Transform url to string

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

Function to convert a Path to another type

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