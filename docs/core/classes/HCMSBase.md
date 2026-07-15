[**@intuiface/core**](../README.md)

***

# Class: HCMSBase

Represents one HCMS base.

## Example

```ts
const base = HCMSService.getBase('catalog');
console.log(base.id, base.name);
```

## Properties

### id

> `readonly` **id**: `string` = `''`

Identifier of the base.

***

### name

> `readonly` **name**: `string` = `''`

Display name of the base.

## Methods

### refresh()

> **refresh**(): `void`

Clears memoized component/item projections for this base.
   *
   *

#### Returns

`void`

#### Example

* ```ts
   * base.refresh();
   * ```

***

### getComponent()

> **getComponent**(`componentId`): [`HCMSGroup`](HCMSGroup.md) \| [`HCMSCollection`](HCMSCollection.md)

Gets a component by id.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `componentId` | `string` | Identifier of the component in the base root. |

#### Returns

[`HCMSGroup`](HCMSGroup.md) \| [`HCMSCollection`](HCMSCollection.md)

A [HCMSGroup](HCMSGroup.md) or [HCMSCollection](HCMSCollection.md), or `null` when unknown.

#### Example

```ts
const component = base.getComponent('products');
if (component && 'items' in component)
{
    console.log('Collection size:', component.items.length);
}
```


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/