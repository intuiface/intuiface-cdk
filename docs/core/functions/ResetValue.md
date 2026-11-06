[**@intuiface/core**](../README.md)

***

# Function: ResetValue()

> **ResetValue**(`options?`): `PropertyDecorator`

Use `@ResetValue({ enabled: false })` to keep a class variable's value when Composer requests a reset.
For example, keep a timer's reference so your code can stop it when needed.

For a variable declared with [\`@Property\`](Property.md), use its `resetOptions` option instead.

**Requires Player 8.3.1 or later.** An interface asset using this decorator cannot be loaded in earlier Player versions.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`IResetValueOptions`](../interfaces/IResetValueOptions.md) | Controls whether the value resets. |

## Returns

`PropertyDecorator`

## Since

Player 8.3.1


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/