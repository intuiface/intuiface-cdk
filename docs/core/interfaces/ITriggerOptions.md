# Interface: ITriggerOptions

Options to configure [`@Trigger`](../README.md#trigger) decorator.

## Table of contents

### Properties

- [name](ITriggerOptions.md#name)
- [displayName](ITriggerOptions.md#displayname)
- [description](ITriggerOptions.md#description)
- [propagationMode](ITriggerOptions.md#propagationmode)
- [propagationDirection](ITriggerOptions.md#propagationdirection)

## Properties

### name

• **name**: `string`

Name used for serialization and identification

___

### displayName

• **displayName**: `string`

Name displayed in Composer.

___

### description

• `Optional` **description**: `string`

Description displayed in Composer.

___

### propagationMode

• `Optional` **propagationMode**: ``"once"`` \| ``"none"`` \| ``"standard"`` \| ``"untilUsed"``

Indicates the mode of propagation:
- `none`: No propagation.
- `standard`: Trigger will propagate through the experience tree of assets and collections until reaching root or leaf.
- `untilUsed`: Same as `standard` but propagation will be stopped when an action is triggered.
- `once`: propagate only one time, which means the trigger will reach either parent or children depending of the `propagationDirection`.

**`Default`**

```ts
'none'
```

___

### propagationDirection

• `Optional` **propagationDirection**: ``"bubbling"`` \| ``"cascading"``

Indicates the direction of propagation:
- `bubbling`: trigger will be ascending the experience tree.
- `cascading`: trigger will propagate through collection's children.

**`Default`**

```ts
'bubbling'
```


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/