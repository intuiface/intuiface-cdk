[**@intuiface/core**](../README.md) • **Docs**

***

# Function: InternalProperty()

> **InternalProperty**(`options`?): (`target`, `propertyKey`) => `void`

Decorator similar to [`@Property`](Property.md) but for property not intended to be exposed in Composer.

When using this decorator on a property, it will automatically generate getter and setter that will raise the [Watchable.notifyPropertyChanged](../classes/Watchable.md#notifypropertychanged) event. You can also set the `affectRendering` option to `true` to indicate that any change made on this property affects rendering and should trigger rendering engine update.

## Parameters

• **options?**

• **options.affectRendering?**: `boolean`

If true, ask visual component update when changed

## Returns

`Function`

### Parameters

• **target**: `unknown`

• **propertyKey**: `string`

### Returns

`void`


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/