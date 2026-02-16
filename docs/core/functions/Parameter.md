[**@intuiface/core**](../README.md)

***

# Function: Parameter()

> **Parameter**(`options?`): [`Function`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function)

The `@Parameter` decorator enables you to declare an action's parameter or a trigger's parameter.

## Parameters

### options?

[`IParameterOptions`](../interfaces/IParameterOptions.md)

options of the parameter (display name, description, ...)

## Returns

[`Function`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function)

## Examples

```ts
/**
 * Action to set the volume of the media.
 */
@Action({
    displayName: 'Set volume', // the display name of the action
    description: 'Set the volume.', // the description of the action
    validate: true // boolean for parameter validation
})
public setVolume(
    @Parameter({ // declaration of the parameter
        name: 'volume', // the name of the parameter (has to match the parameter)
        displayName: 'Volume', // the display name of the parameter
        description: 'Desired volume of the media', // the description of the parameter
        defaultValue: 1, // the default value of the parameter
        minValue: 0, // the minimum value of the parameter
        maxValue: 1, // the maximum value of the parameter
        type: Number // the type of the parameter
    })volume: number): void // the declaration of the parameter to use (same name)
{
    this.volume = volume; // the code of the action
}

```

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


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/