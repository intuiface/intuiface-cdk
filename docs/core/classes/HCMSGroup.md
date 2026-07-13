[**@intuiface/core**](../README.md)

***

# Class: HCMSGroup

Represents an HCMS group component.

Group and item values are exposed as dynamic properties directly available
through bracket notation such as `group['propertyName']`.

## Example

```ts
const component = base.getComponent('header');
if (component && !('items' in component))
{
    const title = component['title'];
    console.log('Header title:', title);
}
```

## Extended by

- [`HCMSItem`](HCMSItem.md)

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

***

### name

#### Get Signature

> **get** **name**(): `string`

Display name of the group.

##### Returns

`string`

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


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/