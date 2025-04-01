[**@intuiface/core**](../README.md) • **Docs**

***

# Function: Trigger()

> **Trigger**(`options`?): (`target`, `propertyKey`, `descriptor`) => `void`

The `@Trigger` decorator enables you to declare a new trigger on your asset that can be used in an Intuiface experience.

## Parameters

• **options?**: [`ITriggerOptions`](../interfaces/ITriggerOptions.md)

options of the trigger (display name, description, ...)

## Returns

`Function`

### Parameters

• **target**: `any`

• **propertyKey**: `string` \| `symbol`

• **descriptor**: `PropertyDescriptor`

### Returns

`void`

## Examples

_**Note**_: the name `raiseButtonReleased` is in camelCase as the naming convention. It is important to do the same in your triggers declaration.

```ts
/**
 * Count changes event
 */
@Trigger({
    name: 'countChanged',
    displayName: 'Count changes'
})
public countChanged(
    @Parameter({
        name: 'count', // the name of the parameter (has to match the parameter)
        displayName: 'count', // the display name of the parameter
        description: 'New count value', // the description of the parameter
        type: Number // the type of the parameter
    }) count: number): void { } //the parameter
```
Please read the section [`@Parameter`](Parameter.md) for more information.


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/