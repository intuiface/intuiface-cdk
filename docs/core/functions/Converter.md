[**@intuiface/core**](../README.md)

***

# Function: Converter()

> **Converter**(`options?`): () => `void`

The `@Converter` decorator enables you to declare a binding converter method that can be packaged as an external Intuiface asset.

Contrary to `@Asset`, this decorator is meant for static methods used by bindings and will automatically register the enclosing class in the generated `.ifd`.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | [`IConverterOptions`](../interfaces/IConverterOptions.md) |
Options to configure the Converter (Display name, description...) |

## Returns

> (): `void`

### Returns

`void`

## Example

```ts
/**
 * Currency formatter converter
 */
export class CurrencyConverter
{
    @Converter({
        displayName: 'Format currency', // the display name of the converter
        description: 'Format a number using the selected currency.', // the description of the converter
        validate: true // boolean for parameter validation
    })
    public static computeOutput(
        @Parameter({ // declaration of the first parameter
            name: 'amount', // the name of the parameter (has to match the parameter)
            displayName: 'Amount', // the display name of the parameter
            description: 'Value to format', // the description of the parameter
            type: Number // the type of the parameter
        }) amount: number, // the declaration of the first parameter to use (same name)
        @Parameter({ // declaration of the second parameter
            name: 'currency', // the name of the parameter (has to match the parameter)
            displayName: 'Currency', // the display name of the parameter
            description: 'Currency code to apply', // the description of the parameter
            defaultValue: 'EUR', // the default value of the parameter
            type: String // the type of the parameter
        }) currency: string): string // the declaration of the second parameter to use (same name)
    {
        return new Intl.NumberFormat('en-US', { // formats the amount using locale and currency options
            style: 'currency', // enables currency style formatting
            currency // applies the currency code provided in parameter
        }).format(amount); // returns the formatted amount
    }
}
```

Please read the section [\`@Parameter\`](Parameter.md)  for more information.

## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/