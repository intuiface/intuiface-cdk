[**@intuiface/core**](../README.md)

***

# Interface: IConverterOptions

Options to configure [\`@Converter\`](../functions/Converter.md) decorator.

## Extends

- [`IActionOptions`](IActionOptions.md)

## Properties

### displayName

> **displayName**: `string`

Name displayed in Composer.

#### Inherited from

[`IActionOptions`](IActionOptions.md).[`displayName`](IActionOptions.md#displayname)

***

### returnType

> **returnType**: `any`

The return type of the converter.
If the converter returns a promise, the type of the resolved value should be specified.
e.g `Promise<String>` should be specified as `String`.

***

### description?

> `optional` **description?**: `string`

Description displayed in Composer.

#### Inherited from

[`IActionOptions`](IActionOptions.md).[`description`](IActionOptions.md#description)

***

### validate?

> `optional` **validate?**: `boolean`

If true, validate range of parameter values.

#### Inherited from

[`IActionOptions`](IActionOptions.md).[`validate`](IActionOptions.md#validate)

***

### category?

> `optional` **category?**: `string`

Indicates the name of the category in which the action will be located in the Composer’s “Action category”

#### Inherited from

[`IActionOptions`](IActionOptions.md).[`category`](IActionOptions.md#category)


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/