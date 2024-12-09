[**@intuiface/core**](../README.md) • **Docs**

***

# Interface: ITriggerOptions

Options to configure [`@Trigger`](../functions/Trigger.md) decorator.

## Properties

### name

> **name**: `string`

Name used for serialization and identification

***

### displayName

> **displayName**: `string`

Name displayed in Composer.

***

### description?

> `optional` **description**: `string`

Description displayed in Composer.

***

### propagationMode?

> `optional` **propagationMode**: `"once"` \| `"none"` \| `"standard"` \| `"untilUsed"`

Indicates the mode of propagation:
- `none`: No propagation.
- `standard`: Trigger will propagate through the experience tree of assets and collections until reaching root or leaf.
- `untilUsed`: Same as `standard` but propagation will be stopped when an action is triggered.
- `once`: propagate only one time, which means the trigger will reach either parent or children depending of the `propagationDirection`.

#### Default

```ts
'none'
```

***

### propagationDirection?

> `optional` **propagationDirection**: `"bubbling"` \| `"cascading"`

Indicates the direction of propagation:
- `bubbling`: trigger will be ascending the experience tree.
- `cascading`: trigger will propagate through collection's children.

#### Default

```ts
'bubbling'
```


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/