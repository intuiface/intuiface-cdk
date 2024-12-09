[**@intuiface/core**](../README.md) • **Docs**

***

# Interface: IConvertibleType

Type can be convertible by implementing this interface. A convertible type can be used as `type` of a [`@Property`](../functions/Property.md) or [`@arameter`](../functions/Parameter.md) decorators. All value will then be converted in input/output when the property or parameter is used for example by bindings.

## Methods

### toString()

> **toString**(): `string`

Transform a type to a string

#### Returns

`string`

***

### convertTo()

> **convertTo**(`type`): `unknown`

Convert a value to type

#### Parameters

• **type**: `unknown`

#### Returns

`unknown`

***

### canConvertTo()

> **canConvertTo**(`type`): `boolean`

Check if the type can be converted to another type

#### Parameters

• **type**: `unknown`

#### Returns

`boolean`


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/