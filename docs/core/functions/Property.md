[**@intuiface/core**](../README.md) • **Docs**

***

# Function: Property()

> **Property**(`options`?): (`target`, `propertyKey`) => `void`

The `@Property` decorator enable you to declare a Property on your asset that can be used in a Intuiface experience.

## Parameters

• **options?**: [`IPropertyOptions`](../interfaces/IPropertyOptions.md)

options of the property (display name, description, ...)

## Returns

`Function`

### Parameters

• **target**: `any`

• **propertyKey**: `string`

### Returns

`void`

## Examples

_**Note**_: the name `volume` is in camelCase as the naming convention. It is important to do the same in your properties declaration.

**With Player version 8.0.3 and after**, you can create your own getter and setter for the property. This is really helpful when you want some logic if the value of the property change.
To do that, you have to declare your property prefixed by `_` (i.e.: `_volume`)
Then create a getter and setter like this :

```ts
@Property({
    displayName: 'Volume', // 'Volume' is the name of the property
    description: 'Current volume in the media.', // here the description of the property
    defaultValue: 1, // the default value of the property : 1
    minValue: 0, // the minimum value : 0
    maxValue: 1, // the maximum value : 1
    type: Number // the property is a number (so binding on a text with '0.5' value will be converted in a number value 0.5)
})
public _volume: number = 0;

public get volume(): number
{
     return this._volume;
} 
public set volume(newVolume: number)
{
     if(newVolume !== this._volume)
     {
         this._volume = newVolume;
         // Put your code here and preferably use `this._volume` instead of `newVolume` as internal Player logic will have apply type conversion and custom range value on it.
     }
}
```

❗⚠️⚠️⚠️⚠️❗For property type `Array` there is a limitation: if you modify the array with methods like `push`, `pop`, `reduce`, `reverse`, `shift`, `sort`, `splice`... without calling a setter (e.g. `this.myArray = [...]`) bindings will not be updated. To fix that, you can use the method [Watchable.notifyPropertyChanged](../classes/Watchable.md#notifypropertychanged).

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
Also the item class should extends [Watchable](../classes/Watchable.md) and have the decorator [Asset](Asset.md):
```ts
@Asset({
 name: 'ListItem',
 behaviors: []
}))
export class ListItem extends Watchable
{
     // Declare here properties for this class 
}
```


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/