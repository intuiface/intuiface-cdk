# @intuiface/core

## Table of contents

### Enumerations

- [CacheStrategy](enums/CacheStrategy.md)
- [CacheScope](enums/CacheScope.md)

### Classes

- [Watchable](classes/Watchable.md)
- [IntuifaceCollection](classes/IntuifaceCollection.md)
- [ElementContainer](classes/ElementContainer.md)
- [IntuifaceElement](classes/IntuifaceElement.md)
- [CacheService](classes/CacheService.md)
- [EnvironmentService](classes/EnvironmentService.md)
- [SystemInfoService](classes/SystemInfoService.md)
- [UsbSerialService](classes/UsbSerialService.md)
- [Color](classes/Color.md)
- [Font](classes/Font.md)
- [Path](classes/Path.md)
- [Resource](classes/Resource.md)
- [Time](classes/Time.md)

### Interfaces

- [IDisposable](interfaces/IDisposable.md)
- [IActionOptions](interfaces/IActionOptions.md)
- [ICollectionConfiguration](interfaces/ICollectionConfiguration.md)
- [CacheEntry](interfaces/CacheEntry.md)
- [CacheOptions](interfaces/CacheOptions.md)
- [IFont](interfaces/IFont.md)

### Functions

- [Computor](README.md#computor)
- [Inject](README.md#inject)
- [DoNotInjectMethod](README.md#donotinjectmethod)
- [Asset](README.md#asset)
- [Collection](README.md#collection)
- [InternalProperty](README.md#internalproperty)
- [Parameter](README.md#parameter)
- [Property](README.md#property)
- [Trigger](README.md#trigger)

### Decorators

- [Action](README.md#action)

## Functions

### Computor

▸ **Computor**(`options`): (`target`: `any`, `propertyKey`: `string` \| `symbol`, `descriptor`: `PropertyDescriptor`) => `void`

Decorator to automatically call the decorated method when one of the inputs changes

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `IComputorOptions` |

#### Returns

`fn`

▸ (`target`, `propertyKey`, `descriptor`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `any` |
| `propertyKey` | `string` \| `symbol` |
| `descriptor` | `PropertyDescriptor` |

##### Returns

`void`

___

### Inject

▸ **Inject**(`options?`): (`ctor`: `Function`) => `void`

Injection method of behaviors in an element.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `IInjectOptions` | options of the injection |

#### Returns

`fn`

▸ (`ctor`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `ctor` | `Function` |

##### Returns

`void`

___

### DoNotInjectMethod

▸ **DoNotInjectMethod**(): (`target`: `unknown`, `propertyKey`: `string` \| `symbol`) => `void`

Avoid to inject method.

#### Returns

`fn`

▸ (`target`, `propertyKey`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `unknown` |
| `propertyKey` | `string` \| `symbol` |

##### Returns

`void`

___

### Asset

▸ **Asset**(`options?`): (`cls`: `any`) => `any`

Asset decorator to add metadatas to asset.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `IElementOptions` | of the asset (display name, description, ...) |

#### Returns

`fn`

▸ (`cls`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `cls` | `any` |

##### Returns

`any`

___

### Collection

▸ **Collection**(`options?`): (`cls`: `any`) => `any`

Collection decorator to add metadatas to collection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `ICollectionOptions` | of the collection (display name, description, ...) |

#### Returns

`fn`

▸ (`cls`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `cls` | `any` |

##### Returns

`any`

___

### InternalProperty

▸ **InternalProperty**(): (`target`: `unknown`, `propertyKey`: `string`) => `void`

Property decorator to notify changes.

#### Returns

`fn`

▸ (`target`, `propertyKey`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `unknown` |
| `propertyKey` | `string` |

##### Returns

`void`

___

### Parameter

▸ **Parameter**(`options?`): `Function`

Parameter decorator to add metadatas to parameter.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `IParameterOptions` | options of the parameter (display name, description, ...) |

#### Returns

`Function`

___

### Property

▸ **Property**(`options?`): (`target`: `any`, `propertyKey`: `string`) => `void`

Property decorator to add metadatas to property.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `IPropertyOptions` | options of the property (display name, description, ...) |

#### Returns

`fn`

▸ (`target`, `propertyKey`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `any` |
| `propertyKey` | `string` |

##### Returns

`void`

___

### Trigger

▸ **Trigger**(`options?`): (`target`: `any`, `propertyKey`: `string` \| `symbol`, `descriptor`: `PropertyDescriptor`) => `void`

Trigger decorator to add metadatas to trigger.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `ITriggerOptions` | options of the trigger (display name, description, ...) |

#### Returns

`fn`

▸ (`target`, `propertyKey`, `descriptor`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `any` |
| `propertyKey` | `string` \| `symbol` |
| `descriptor` | `PropertyDescriptor` |

##### Returns

`void`

## Decorators

### Action

▸ **Action**(`options?`): (`target`: `unknown`, `propertyKey`: `string` \| `symbol`, `descriptor`: `PropertyDescriptor`) => `void`

Action decorator to add metadatas to action.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`IActionOptions`](interfaces/IActionOptions.md) | options of the action (display name, description, ...) |

#### Returns

`fn`

▸ (`target`, `propertyKey`, `descriptor`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `unknown` |
| `propertyKey` | `string` \| `symbol` |
| `descriptor` | `PropertyDescriptor` |

##### Returns

`void`
