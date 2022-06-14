<p align="center">
  <a href="https://www.intuiface.com">
    <img src="https://assets-global.website-files.com/6090f790a8effe00c12b39d0/6090f790a8effef0002b3c56_Intuiface%20logo%20animated.gif" alt="Intuiface logo" width="200" height="86">
  </a>
</p>

# Intuiface Core

The core library to use when creating a custom asset or collection or an interface asset

## Table of contents

- [Decorators](#decorators)
    - [Property](#property)
    - [Trigger](#trigger)
    - [Action](#action)
    - [Parameter](#parameter)
- [Types](#types)
- [Help](#help)
## Decorators
In Intuiface Core, we use [typescript decorators](https://www.typescriptlang.org/docs/handbook/decorators.html) to manage Properties, Triggers and Actions into Intuiface Composer.

### Property

The `@Property` decorator allows you to declare a new property with :
```ts
/**
 * Name of the property displayed in Composer.
 * Required
 */
displayName: string;

/**
 * Description of the property displayed in Composer.
 * Optional
 */
description?: string;

/**
 * Default value of the property.
 * Optional
 */
defaultValue?: any;

/**
 * Minimum value for this property.
 * Optional
 */
minValue?: number;

/**
 * Maximum value for this property.
 * Optional
 */
maxValue?: number;

/**
 * True if property is read only in Intuiface Composer.
 * Optional
 */
readOnly?: boolean;

/**
 * The type of the property.
 * Can  be : 
 * - String
 * - Number
 * - Boolean
 * - Array
 * - Class name of convertible type (Color, Font, Path, Resource, Time)
 * - Enum type
 * Optional but it's better to specify it for Binding conversion
 */
type?: any;

/**
 * The item type in case the type is array
 * Can be :
 * - Class Name
 * - String
 * - Number
 * - Boolean
 * Optional but usefull in interface asset to display properties of the item in Intuiface Composer
 */
itemType?: any;

```

Here an example : 
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

❗⚠️⚠️⚠️⚠️❗ For property type `Array` there is a limitation : if you modify the array with methods like `push`, `pop`, `reduce`, `reverse`, `shift`, `sort`, `slice`, `splice`... without calling a setter (ie. `myArray = [...]`) bindings will not be updated. To fix that, you can use the method `notifyPropertyChanged`.

Example, I have an item list declared like this : 
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

I have an action which adds an item to list with the `push` method. I have to make this code to be sure all my bindings will be resolved when I add a new item : 
```ts
// add my new item to the list
this.listItems.push(newItem);
// call the notify property changed
this.notifyPropertyChanged('listItems', this.listItems);
```




### Trigger
The `@Trigger` decorator allows you to declare a new trigger with :
```ts
/**
 * Name used for serialization and identification
 * Required
 */
name: string;

/**
 * Name displayed in Composer.
 * Required
 */
displayName: string;

/**
 * Description displayed in Composer.
 * Optional
 */
description?: string;

/**
 * Indicates whether this trigger needs to propagate to other elements
 * Optional
 */
isPropagating?: boolean;

/**
 * Propagation mode (BUBBLING | CASCADING)
 * Optional
 */
mode?: string;
```

Here an example : 
```ts
/**
 * Trigger when button is pressed
 */
@Trigger({
    name: 'Released', // name of the trigger
    displayName: 'Is released', // display name in composer
    description: 'Raised when the button is released.', // description of the trigger
    isPropagating: true, // this trigger will be propagating
    mode: 'BUBBLING' // the propagation will bubble to parent elements
})
public raiseButtonReleased(): void { } // the trigger is an empty function
```
If your trigger has parameter(s), please read the section [Parameter](#parameter) to understand how to make them available in Intuiface Composer.

### Action
The `@Action` decorator allows you to declare a new action with :
```ts
/**
 * Name displayed in Composer.
 * Required
 */
displayName: string;

/**
 * Description displayed in Composer.
 * Optional
 */
description?: string;

/**
 * If true, validate range of parameter values.
 * Optional
 */
validate?: boolean;
```

Here an example:
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

If your action has parameter(s), please read the section [Parameter](#parameter) to understand how to make them available in Intuiface Composer.

### Parameter
The `@Parameter` decorator allows you to declare a new action parameter or a trigger parameter with :

```ts
/**
 * The name of the parameter
 * Required
 */
name: string;

/**
 * Name displayed in Composer.
 * Required
 */
displayName: string;

/**
 * Description displayed in Composer.
 * Optional
 */
description?: string;

/**
 * Default value of the parameter.
 * Optional
 */
defaultValue?: any;

/**
 * Minimum value for this parameter.
 * Optional
 */
minValue?: number;

/**
 * Maximum value for this parameter.
 * Optional
 */
maxValue?: number;

/**
 * The type of the parameter
 * Optional
 * 
 * Can  be : 
 * - String
 * - Number
 * - Boolean
 * - Array
 * - Class name of convertible type (Color, Font, Path, Resource, Time)
 * - Enum type
 */
type?: any;
```

Here an example of action with parameter : 

```ts
/**
 * Action to set the volume of the media.
 */
@Action({
    displayName: 'Set volume', // the display name of the action
    description: 'Set the volume.', // the description of the action
    validate: true // boolean for parameters validation
})
public setVolume(
    @Parameter({ // declaration of the parameter
        name: 'volume', // the name of the parameter (has to match with the parameter)
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

And here an exmple of a trigger with parameter : 
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
        name: 'count', // the name of the parameter (has to match with the parameter)
        displayName: 'count', // the display name of the parameter
        description: 'New count value', // the description of the parameter
        type: Number // the type of the parameter
    }) count: number): void { } //the parameter
```

### Asset
TODO : will be done when the custom asset creation will be available
### Collection
TODO : will be done when the custom asset creation will be available
### Inject
TODO : will be done when the custom asset creation will be available
### DoNotInjectMethod
TODO : will be done when the custom asset creation will be available

## Types
We included different types for properties and parameters :
- Color
- Font
- Path
- Resource
- Time

## Help

Found a problem, a bug ? Or need some help ? 
Please do not create an issue in Github, ask us on our support page : https://support.intuiface.com/