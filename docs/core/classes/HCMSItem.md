[**@intuiface/core**](../README.md)

***

# Class: HCMSItem

Represents one item of an H-CMS collection.

Item values are exposed as dynamic properties directly available through
bracket notation such as `item['propertyName']`.

## Example

```ts
const item = collection.items[0];
if (item)
{
    console.log(item.id, item['title'], item['price']);
}
```

## Extends

- [`HCMSGroup`](HCMSGroup.md)

## Indexable

> \[`propertyName`: `string`\]: `any`

Gets the value of a dynamic property of this group.

### Example

```ts
const title = group['title'];
```

## Accessors

### id

#### Get Signature

> **get** **id**(): `string`

Identifier of the group.

##### Returns

`string`

#### Inherited from

[`HCMSGroup`](HCMSGroup.md).[`id`](HCMSGroup.md#id)

***

### name

#### Get Signature

> **get** **name**(): `string`

Display name of the group.

##### Returns

`string`

#### Inherited from

[`HCMSGroup`](HCMSGroup.md).[`name`](HCMSGroup.md#name)

## Methods

### refresh()

> **refresh**(): `void`

Rebuilds projected dynamic properties for this group.
   *
   *

#### Returns

`void`

#### Example

* ```ts
   * group.refresh();
   * ```

#### Inherited from

[`HCMSGroup`](HCMSGroup.md).[`refresh`](HCMSGroup.md#refresh)


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/