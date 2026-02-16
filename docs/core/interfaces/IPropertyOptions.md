[**@intuiface/core**](../README.md)

***

# Interface: IPropertyOptions

Options used to configure [\`@Property\`](../functions/Property.md) decorator

## Properties

### displayName

> **displayName**: `string`

Name of the property displayed in Composer.

***

### description?

> `optional` **description**: `string`

Description of the property displayed in Composer.

***

### defaultValue?

> `optional` **defaultValue**: `any`

Default value of the property.

***

### minValue?

> `optional` **minValue**: `number`

Minimum value for this property.  
If specified, any number value smaller than this value will be ignored when and replaced by the minimum.

***

### maxValue?

> `optional` **maxValue**: `number`

Maximum value for this property.  
If specified, any number value greater than this value will be ignored when and replaced by the maximum.

***

### readOnly?

> `optional` **readOnly**: `boolean`

True if property is read only in Intuiface Composer. The property will only be usable as a binding source.

***

### type?

> `optional` **type**: `any`

The type of the property.
It's optional but highly recommended for better binding conversion.
It can be:
- `String`
- `Number`
- `Boolean`
- `Array`
- Class name of a [convertible type](IConvertibleType.md) (`Color`, `Font`, `Path`, `Resource`, `Time`)
- Enum type
- Class name of another class you created

***

### itemType?

> `optional` **itemType**: `any`

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