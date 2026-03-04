[**@intuiface/core**](../README.md)

***

# Function: Computor()

> **Computor**(`options`): (`target`, `propertyKey`, `descriptor`) => `void`

The `@Computor` decorator can be added on a method that will be automatically called when one of the inputs declared in options changes.

Computor listens to input changes on instance of [Watchable](../classes/Watchable.md). This means all listed inputs must notify changes with [Watchable.notifyPropertyChanged](../classes/Watchable.md#notifypropertychanged) to trigger a computor call.

Inputs values will be passed as arguments of the method in the order they appears in the `inputs` array in `options`.

## Parameters

### options

[`IComputorOptions`](../interfaces/IComputorOptions.md)

Options to configure the computor

## Returns

> (`target`, `propertyKey`, `descriptor`): `void`

### Parameters

#### target

`any`

#### propertyKey

`string` | `symbol`

#### descriptor

`PropertyDescriptor`

### Returns

`void`

## Example

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


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/