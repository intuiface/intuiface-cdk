[**@intuiface/core**](../README.md) • **Docs**

***

# Interface: IElementOptions

Options to configure [`@Asset`](../functions/Asset.md) decorator.

## Extends

- `IInjectOptions`

## Properties

### behaviors

> **behaviors**: [`Function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)[]

Behaviors to inject on the decorated element.

Behaviors are not yet exposed in Intuiface CDK. For now, only pass a empty array `[]`.

#### Inherited from

`IInjectOptions.behaviors`

***

### name

> **name**: `string`

Name used for serialization and identification.  
It must be the name of the class.

***

### category

> **category**: `string`

Category in Composer's Interface Assets panel.

***

### displayName?

> `optional` **displayName**: `string`

Name displayed in Composer.

***

### description?

> `optional` **description**: `string`

Description displayed in Composer.


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/