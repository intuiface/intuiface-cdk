# Interface: IElementOptions

Options to configure [`@Asset`](../README.md#asset) decorator.

## Hierarchy

- `IInjectOptions`

  ↳ **`IElementOptions`**

## Table of contents

### Properties

- [behaviors](IElementOptions.md#behaviors)
- [name](IElementOptions.md#name)
- [category](IElementOptions.md#category)
- [displayName](IElementOptions.md#displayname)
- [description](IElementOptions.md#description)

## Properties

### behaviors

• **behaviors**: [`Function`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function )[]

Behaviors to inject on the decorated element.

Behaviors are not yet exposed in Intuiface CDK. For now, only pass a empty array `[]`.

#### Inherited from

IInjectOptions.behaviors

___

### name

• **name**: `string`

Name used for serialization and identification

___

### category

• **category**: `string`

Category in Composer's Interface Assets panel.

___

### displayName

• `Optional` **displayName**: `string`

Name displayed in Composer.

___

### description

• `Optional` **description**: `string`

Description displayed in Composer.


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/