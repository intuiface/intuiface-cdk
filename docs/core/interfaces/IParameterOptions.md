[**@intuiface/core**](../README.md)

***

# Interface: IParameterOptions

Options to configure [\`@Parameter\`](../functions/Parameter.md) decorator.

## Properties

### name

> **name**: `string`

The name of the parameter

***

### displayName

> **displayName**: `string`

Name displayed in Composer.

***

### description?

> `optional` **description**: `string`

Description displayed in Composer.

***

### defaultValue?

> `optional` **defaultValue**: `any`

Default value of the parameter.

***

### minValue?

> `optional` **minValue**: `number`

Minimum value for this parameter.

***

### maxValue?

> `optional` **maxValue**: `number`

Maximum value for this parameter.

***

### type?

> `optional` **type**: `any`

The type of the parameter.
It's optional but higly recommended fo better binding conversion.
It can be:
- `String`
- `Number`
- `Boolean`
- `Array`
- Classe name of a [convertible type](IConvertibleType.md) (`Color`, `Font`, `Path`, `Resource`, `Time`)
- Enum type


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/