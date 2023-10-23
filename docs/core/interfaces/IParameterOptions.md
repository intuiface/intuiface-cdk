# Interface: IParameterOptions

Options to configure [`@Parameter`](../README.md#parameter) decorator.

## Table of contents

### Properties

- [name](IParameterOptions.md#name)
- [displayName](IParameterOptions.md#displayname)
- [description](IParameterOptions.md#description)
- [defaultValue](IParameterOptions.md#defaultvalue)
- [minValue](IParameterOptions.md#minvalue)
- [maxValue](IParameterOptions.md#maxvalue)
- [type](IParameterOptions.md#type)

## Properties

### name

• **name**: `string`

The name of the parameter

___

### displayName

• **displayName**: `string`

Name displayed in Composer.

___

### description

• `Optional` **description**: `string`

Description displayed in Composer.

___

### defaultValue

• `Optional` **defaultValue**: `any`

Default value of the parameter.

___

### minValue

• `Optional` **minValue**: `number`

Minimum value for this parameter.

___

### maxValue

• `Optional` **maxValue**: `number`

Maximum value for this parameter.

___

### type

• `Optional` **type**: `any`

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