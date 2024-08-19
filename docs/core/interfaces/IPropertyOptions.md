# Interface: IPropertyOptions

Options used to configure [`@Property`](../README.md#property) decorator

## Table of contents

### Properties

- [displayName](IPropertyOptions.md#displayname)
- [description](IPropertyOptions.md#description)
- [defaultValue](IPropertyOptions.md#defaultvalue)
- [minValue](IPropertyOptions.md#minvalue)
- [maxValue](IPropertyOptions.md#maxvalue)
- [readOnly](IPropertyOptions.md#readonly)
- [type](IPropertyOptions.md#type)
- [itemType](IPropertyOptions.md#itemtype)

## Properties

### displayName

• **displayName**: `string`

Name of the property displayed in Composer.

___

### description

• `Optional` **description**: `string`

Description of the property displayed in Composer.

___

### defaultValue

• `Optional` **defaultValue**: `any`

Default value of the property.

___

### minValue

• `Optional` **minValue**: `number`

Minimum value for this property.

___

### maxValue

• `Optional` **maxValue**: `number`

Maximum value for this property.

___

### readOnly

• `Optional` **readOnly**: `boolean`

True if property is read only in Intuiface Composer. The property will only be usable as a binding source.

___

### type

• `Optional` **type**: `any`

The type of the property.
It's optional but highly recommended for better binding conversion.
It can be:
- `String`
- `Number`
- `Boolean`
- `Array`
- Classe name of a [convertible type](IConvertibleType.md) (`Color`, `Font`, `Path`, `Resource`, `Time`)
- Enum type
- Class name of another class you created

___

### itemType

• `Optional` **itemType**: `any`

The item type in case the type is `Array`.
It's optional but useful in interface assets to display item's properties in Intuiface Composer.
It can be:
 - Class name
 - `String`
 - `Number`
 - `Boolean`


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/