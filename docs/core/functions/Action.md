[**@intuiface/core**](../README.md)

***

# Function: Action()

> **Action**(`options?`): () => `void`

The `@Action` decorator enables you to declare an Action that can be used by Triggers in Intuiface Composer

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | [`IActionOptions`](../interfaces/IActionOptions.md) | Options to configure the Action (Display name, description...) |

## Returns

() => `void`

## Examples

```ts
/**
 * Turn on autoplay.
 */
 @Action({
  displayName: 'Turn Autoplay mode on', // display name of the action
  description: 'Turn Autoplay mode on.' // description of the action
 })
public turnOnAutoplay(): void
{
   this.isAutoplay = true; // code of the action
}
```
_**Note**_: the name "turnOnAutoplay" is in camelCase as the naming convention. It is important to do the same in your actions declaration.

If your action has parameter(s), you can specify them with `@Parameter` decorator:
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

Please read the section [\`@Parameter\`](Parameter.md)  for more information.


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/