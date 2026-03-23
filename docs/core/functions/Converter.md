[**@intuiface/core**](../README.md)

***

# Function: Converter()

> **Converter**(`options?`): (`target`, `propertyKey`, `descriptor`) => `void`

The `@Converter` decorator enables you to declare a binding converter method that can be packaged as an external Intuiface asset.

Contrary to `@Asset`, this decorator is meant for static methods used by bindings and will automatically register the enclosing class in the generated `.ifd`.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | [`IConverterOptions`](../interfaces/IConverterOptions.md) |

## Returns

> (`target`, `propertyKey`, `descriptor`): `void`

### Parameters

| Parameter | Type |
| ------ | ------ |
| `target` | `any` |
| `propertyKey` | `string` \| `symbol` |
| `descriptor` | `PropertyDescriptor` |

### Returns

`void`

## Example


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/