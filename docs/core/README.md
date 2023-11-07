<p align="center">
    <a href="https://www.intuiface.com">
        <img src="https://assets-global.website-files.com/6090f790a8effe00c12b39d0/6090f790a8effef0002b3c56_Intuiface%20logo%20animated.gif" alt="Intuiface logo" width="200" height="86">
    </a>
</p>

# @intuiface/core

This library will enables you to create custom interface assets that can be used in your Intuiface experiences.

In `@intuiface/core`, we use [TypeScript decorators](https://www.typescriptlang.org/docs/handbook/decorators.html) to declare Properties, Triggers and Actions exposed in Intuiface Composer. You can find all [available decorators](#Decorators) in this documentation.

`@intuiface/core` also exposes services that will help you access low level information (device's id, name, os...), hardware, cache... in an easy and cross-platform way.

Use the [`@intuiface/interface-asset`](../../libs/tools/schematics/interface-asset-schematics/README.md) to create and initialize your project workspace. Then you can use [IntuifaceElement](classes/IntuifaceElement.md) and [`@Asset`](README.md#asset) decorator to declare your interface asset and [`@Property`](README.md#property), [`@Trigger`](README.md#trigger) and [`@Action`](README.md#action) decorators to customize it. See [`@Asset`](README.md#asset) example for a squeleton class of a custom interface asset.

**`Remarks`**

Before reading how to create interface assets and declare Properties, Triggers, Actions and Parameters, please note that we choose to use the _camelCase_ naming convention.

## Table of contents

### Enumerations

- [CacheStrategy](enums/CacheStrategy.md)
- [CacheScope](enums/CacheScope.md)

### Classes

- [Watchable](classes/Watchable.md)
- [IntuifaceCollection](classes/IntuifaceCollection.md)
- [ElementContainer](classes/ElementContainer.md)
- [IntuifaceElement](classes/IntuifaceElement.md)

### Interfaces

- [IDisposable](interfaces/IDisposable.md)
- [IActionOptions](interfaces/IActionOptions.md)
- [IComputorOptions](interfaces/IComputorOptions.md)
- [IElementOptions](interfaces/IElementOptions.md)
- [IParameterOptions](interfaces/IParameterOptions.md)
- [IPropertyOptions](interfaces/IPropertyOptions.md)
- [ITriggerOptions](interfaces/ITriggerOptions.md)
- [ICollectionConfiguration](interfaces/ICollectionConfiguration.md)
- [CacheEntry](interfaces/CacheEntry.md)
- [CacheOptions](interfaces/CacheOptions.md)
- [DownloadProgress](interfaces/DownloadProgress.md)

### Decorators

- [Action](README.md#action)
- [Computor](README.md#computor)
- [Asset](README.md#asset)
- [Collection](README.md#collection)
- [InternalProperty](README.md#internalproperty)
- [Parameter](README.md#parameter)
- [Property](README.md#property)
- [Trigger](README.md#trigger)

### Services

- [CacheService](classes/CacheService.md)
- [EnvironmentService](classes/EnvironmentService.md)
- [SystemInfoService](classes/SystemInfoService.md)
- [UsbSerialService](classes/UsbSerialService.md)

### Types

- [Color](classes/Color.md)
- [IConvertibleType](interfaces/IConvertibleType.md)
- [Typeface](interfaces/Typeface.md)
- [Font](classes/Font.md)
- [LinearGradient](classes/LinearGradient.md)
- [Path](classes/Path.md)
- [RadialGradient](classes/RadialGradient.md)
- [Resource](classes/Resource.md)
- [SolidColor](classes/SolidColor.md)
- [Time](classes/Time.md)

## Decorators

### Action

▸ **Action**(`options?`): () => `void`

The `@Action` decorator enables you to declare an Action that can be used by Triggers in Intuiface Composer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`IActionOptions`](interfaces/IActionOptions.md) | Options to configure the Action (Display name, description...) |



**`Example`**

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
_**Note**_: the name "turnOnAutoplay" is in camelCase as the naming convention.

**`Example`**

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

Please read the section [`@Parameter`](README.md#parameter)  for more information.

___

### Computor

▸ **Computor**(`options`): (`target`: `any`, `propertyKey`: `string` \| `symbol`, `descriptor`: `PropertyDescriptor`) => `void`

The `@Computor` decorator can be added on a method that will be automatically called when one of the inputs declared in options changes.

Computor listens to input changes on instance of [Watchable](classes/Watchable.md). This means all listed inputs must notify changes with [Watchable.notifyPropertyChanged](classes/Watchable.md#notifypropertychanged) to trigger a computor call.

Inputs values will be passed as arguments of the method in the order they appears in the `inputs` array in `options`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`IComputorOptions`](interfaces/IComputorOptions.md) | Options to configure the computor |



**`Example`**

A method that will be called when `scale` or `width` changes to compute a width with the applied scaled:
```ts
   @Property({
       displayName: 'scale',
       type: Number
   })
   public scale: number;

   @Property({
       displayName: 'width',
       type: Number
   })
   public width: number;

   @Property({
       displayName: 'Computed width',
       readOnly: true,
       type: Number
   })
   public computedWidth: number;

   @Computor({
       inputs: ['scale', 'width']
   })
   private computeWidth(scale: number, width: number): void
   {
       this.computedWidth = scale * width;
   }
```
Note that `scale` and `width` are in the same order in `inputs` and as `computeWidth` arguments.

___

### Asset

▸ **Asset**(`options?`): (`cls`: `any`) => `any`

The `@Asset` decorator enables you to declare an interface asset that can be used in an Intuiface experience.

The `@Asset` decorator is placed on a class and you can then declare properties, triggers and anction using decorators [`@Property`](README.md#property), [`@Trigger`](README.md#trigger) and [`@Action`](README.md#action) inside this class.

An asset class must extends [IntuifaceElement](classes/IntuifaceElement.md).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`IElementOptions`](interfaces/IElementOptions.md) | of the asset (display name, description, ...) |



**`Example`**

Squeleton of an interface asset class:
```ts
/**
 * Custom Interface Asset
 */
@Asset({
    name: 'MyCustomInterfaceAsset',
    behaviors: []
})
export class MyCustomInterfaceAsset extends IntuifaceElement {

    /**
     * Property example
     */
    @Property({
        displayName: 'propertyExample',
        description: 'A property declaration example.',
        defaultValue: 0,
        minValue: 0,
        maxValue: 10,
        type: Number
    })
    public propertyExample: number = 0;

    /**
     * Trigger Example
     */
    @Trigger({
        name: 'exampleTrigger',
        displayName: 'A Trigger Example',
        description: 'Raised when the property example changed'
    })
    public exampleTrigger(): void {}

    /**
     * Action Example
     */
    @Action({
        displayName: 'Action Example',
        description: 'An Action example with a parameter and validation',
        validate: true
    })
    public actionExample(
        @Parameter({
            name: 'actionParam',
            displayName: 'Action parameter',
            description: 'An action parameter example.',
            defaultValue: 1,
            minValue: 0,
            maxValue: 10,
            type: Number
        }) actionParam: number): void
    {
        if (this.propertyExample !== actionParam) {
            this.propertyExample = actionParam;
            // raise the trigger
            this.exampleTrigger();
        }
    }
}
```

___

### Collection

▸ **Collection**(`options?`): (`cls`: `any`) => `any`

The `@Collection` decorator enables you to declare a custom collection that can be used in an Intuiface experience.

_**This is experimental as there is currently no way to use a custom collection created with the CDK in Intuiface Composer.**_

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `ICollectionOptions` | of the collection (display name, description, ...) |



___

### InternalProperty

▸ **InternalProperty**(`options?`): (`target`: `unknown`, `propertyKey`: `string`) => `void`

Decorator similar to [`@Property`](README.md#property) but for property not intended to be exposed in Composer.

When using this decorator on a property, it will automatically generate getter and setter that will raise the [Watchable.notifyPropertyChanged](classes/Watchable.md#notifypropertychanged) event. You can also set the `affectRendering` option to `true` to indicate that any change made on this property affects rendering and should trigger rendering engine update.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `Object` | - |
| `options.affectRendering?` | `boolean` | If true, ask visual component update when changed |



___

### Parameter

▸ **Parameter**(`options?`): [`Function`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function )

The `@Parameter` decorator enables you to declare an action's parameter or a trigger's parameter.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`IParameterOptions`](interfaces/IParameterOptions.md) | options of the parameter (display name, description, ...) |

#### Returns

[`Function`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function )

**`Example`**

An action with paramters:
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

**`Example`**

A trigger with paramters
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

___

### Property

▸ **Property**(`options?`): (`target`: `any`, `propertyKey`: `string`) => `void`

The `@Property` decorator enable you to declare a Property on your asset that can be used in a Intuiface experience.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`IPropertyOptions`](interfaces/IPropertyOptions.md) | options of the property (display name, description, ...) |



**`Example`**

```ts
@Property({
    displayName: 'Volume', // 'Volume' is the name of the property
    description: 'Current volume in the media.', // here the description of the property
    defaultValue: 1, // the default value of the property : 1
    minValue: 0, // the minimum value : 0
    maxValue: 1, // the maximum value : 1
    type: Number // the property is a number (so binding on a text with '0.5' value will be converted in a number value 0.5)
})
public volume: number = 0; // declaration of the property
```
_**Note**_: the name `volume` is in camelCase as the naming convention.

❗⚠️⚠️⚠️⚠️❗For property type `Array` there is a limitation: if you modofy the array with methods like `push`, `pop`, `reduce`, `reverse`, `shift`, `sort`, `splice`... without calling a setter (e.g. `this.myArray = [...]`) bindings will not be updated. To fix that, you can use the method [Watchable.notifyPropertyChanged](classes/Watchable.md#notifypropertychanged).

**`Example`**

I have an itme list declared like this:
```ts
/**
 * Item List
 */
@Property({
    displayName: 'List Items',
    defaultValue: [],
    type: Array,
    itemType: ListItem
})
public listItems: ListItem[] = [];
```
I have an action which adds an item to the list using the `push` method. I have to add this code to be sure all my bindings will be resolved when I add a new item:
```ts
// add my new item to the list
this.listItems.push(newItem);
// call the notify property changed
this.notifyPropertyChanged('listItems', this.listItems);
```

___

### Trigger

▸ **Trigger**(`options?`): (`target`: `any`, `propertyKey`: `string` \| `symbol`, `descriptor`: `PropertyDescriptor`) => `void`

The `@Trigger` decorator enables you to declare a new trigger on your asset that can be used in an Intuiface experience.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`ITriggerOptions`](interfaces/ITriggerOptions.md) | options of the trigger (display name, description, ...) |



**`Example`**

```ts
/**
 * Trigger when button is pressed
 */
@Trigger({
    name: 'Released', // name of the trigger
    displayName: 'Is released', // display name in composer
    description: 'Raised when the button is released.', // description of the trigger
    propagationMode: EPropagationMode.Standard, // this trigger will be propagating
    mode: ERoutingMode.BUBBLING // the propagation will bubble to parent elements
})
public raiseButtonReleased(): void { } // the trigger is an empty function
```
_**Note**_: the name `raiseButtonReleased` is in camelCase as the naming convention

**`Example`**

If your trigger has parameter(s), you can specify them with `@Parameter` decorator, the same way you declare paramters for actions.
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
Please read the section [`@Parameter`](README.md#parameter) for more information.


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/