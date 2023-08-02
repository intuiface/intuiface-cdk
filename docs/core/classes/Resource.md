# Class: Resource

Resource type

## Implements

- `IConvertibleType`

## Table of contents

### Methods

- [convertFrom](Resource.md#convertfrom)
- [canConvertFrom](Resource.md#canconvertfrom)
- [toString](Resource.md#tostring)
- [canConvertTo](Resource.md#canconvertto)
- [convertTo](Resource.md#convertto)

## Methods

### convertFrom

▸ `Static` **convertFrom**(`value`, `propertyOwner?`): [`Resource`](Resource.md)

Convert a value to a Resource

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | value to convert |
| `propertyOwner?` | `any` | - |

#### Returns

[`Resource`](Resource.md)

___

### canConvertFrom

▸ `Static` **canConvertFrom**(`value`): `boolean`

Check if we can convert value to Resource

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | value to convert |

#### Returns

`boolean`

___

### toString

▸ **toString**(): `string`

Transform resource to string

#### Returns

`string`

#### Implementation of

IConvertibleType.toString

___

### canConvertTo

▸ **canConvertTo**(`type`): `boolean`

Check if the type can be converted

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `unknown` | targeted type |

#### Returns

`boolean`

#### Implementation of

IConvertibleType.canConvertTo

___

### convertTo

▸ **convertTo**(`type`): `unknown`

Function to convert a Resource to another type

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `type` | `unknown` | targeted type |

#### Returns

`unknown`

#### Implementation of

IConvertibleType.convertTo
