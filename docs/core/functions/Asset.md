[**@intuiface/core**](../README.md) • **Docs**

***

# Function: Asset()

> **Asset**(`options`?): (`cls`) => `any`

The `@Asset` decorator enables you to declare an interface asset that can be used in an Intuiface experience.

The `@Asset` decorator is placed on a class and you can then declare properties, triggers and action using decorators [`@Property`](Property.md), [`@Trigger`](Trigger.md) and [`@Action`](Action.md) inside this class.

An asset class must extends [IntuifaceElement](../classes/IntuifaceElement.md).

## Parameters

• **options?**: [`IElementOptions`](../interfaces/IElementOptions.md)

: options of the asset (name, display name, description, ...) The option 'name' is important to match the class name. And this can be use in a property to declare its type as another class name. 
For this see [`itemType`](../interfaces/IPropertyOptions.md).

## Returns

`Function`

### Parameters

• **cls**: `any`

### Returns

`any`

## Example

```ts
/**
 * Custom Interface Asset
 */
@Asset({
    name: 'MyCustomInterfaceAsset',
    displayName: 'Custom interface asset',
    category: 'My Custom Interface Asset Category',
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


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/