[**@intuiface/core**](../README.md)

***

# Class: HCMSService

Service exposing a read-only view of HCMS bases loaded in Player.

Use this service to retrieve a base by id and navigate its components and items.

## Example

Basic retrieval and navigation:
```ts
const base = HCMSService.getBase('my-base-id');
const component = base.getComponent('my-component-id');
```

## Methods

### getBase()

> `static` **getBase**(`baseId`): [`HCMSBase`](HCMSBase.md)

Gets an HCMS base by id.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `baseId` | `string` | Identifier of the HCMS base. |

#### Returns

[`HCMSBase`](HCMSBase.md)

The matching [HCMSBase](HCMSBase.md).

#### Throws

Error if `baseId` is empty.

#### Throws

Error if the base is not initialized in the running Player context.

#### Example

```ts
const base = HCMSService.getBase('catalog');
console.log(base.id, base.name);
```

***

### refreshBase()

> `static` **refreshBase**(`baseId`): [`HCMSBase`](HCMSBase.md)

Manually refreshes memoized objects for one base.

Call this after a base synchronization when you want to invalidate cached
components/items and force a rebuild on next access.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `baseId` | `string` | Identifier of the HCMS base. |

#### Returns

[`HCMSBase`](HCMSBase.md)

The refreshed [HCMSBase](HCMSBase.md) instance.

#### Example

```ts
// Trigger your own sync process first with trigger/action within your experience, then refresh the base in the `HCMSService`.
const refreshedBase = HCMSService.refreshBase('catalog');
```


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/