# Class: Resource

Class to use when a property is using a resource from an experience.

**`Example`**

```ts
@Property({
    displayName: 'Source',
    description: 'Source of the data.',
    defaultValue: null,
    type: Resource
})
public source: Resource;
```

## Implements

- [`IConvertibleType`](../interfaces/IConvertibleType.md)

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

[IConvertibleType](../interfaces/IConvertibleType.md).[toString](../interfaces/IConvertibleType.md#tostring)

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

[IConvertibleType](../interfaces/IConvertibleType.md).[canConvertTo](../interfaces/IConvertibleType.md#canconvertto)

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

[IConvertibleType](../interfaces/IConvertibleType.md).[convertTo](../interfaces/IConvertibleType.md#convertto)


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/