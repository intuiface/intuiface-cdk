[**@intuiface/core**](../README.md)

***

# Class: HCMSCollection

Represents an HCMS collection component.

## Example

```ts
const component = base.getComponent('products');
if (component && 'items' in component)
{
    component.items.forEach((item) => {
        console.log(item.id, item['price']);
    });
}
```

## Properties

### id

> `readonly` **id**: `string` = `''`

Identifier of the collection.

***

### name

> `readonly` **name**: `string` = `''`

Display name of the collection.

***

### items

> `readonly` **items**: [`HCMSItem`](HCMSItem.md)[] = `[]`

Items currently exposed by the collection.
   *
   *

#### Example

* ```ts
   * const first = collection.items[0];
   * if (first)
   * {
   *     console.log(first.name, first['description']);
   * }
   * ```

## Methods

### refresh()

> **refresh**(): `void`

Clears memoized item projections for this collection.
   *
   *

#### Returns

`void`

#### Example

* ```ts
   * collection.refresh();
   * ```


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/