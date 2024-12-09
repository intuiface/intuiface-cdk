[**@intuiface/core**](../README.md) • **Docs**

***

# Class: Time

Class to use to describe a time duration.

## Example

## Implements

- [`IConvertibleType`](../interfaces/IConvertibleType.md)

## Constructors

### new Time()

> **new Time**(`hours`, `minutes`, `seconds`): [`Time`](Time.md)

Create a new time with given hours, minutes and seconds.

#### Parameters

• **hours**: `number`

hours of the time

• **minutes**: `number`

minutes of the time

• **seconds**: `number`

seconds of the time

#### Returns

[`Time`](Time.md)

## Properties

### Zero

> `readonly` `static` **Zero**: [`Time`](Time.md)

Instance of time representing an empty duration of zero.

***

### One

> `readonly` `static` **One**: [`Time`](Time.md)

Instance of time representing a duration of 1 second.

***

### strTime

> `readonly` **strTime**: `string`

Time in string format

***

### strTimeWithoutMilliseconds

> `readonly` **strTimeWithoutMilliseconds**: `string`

Time in string format without milliseconds

***

### totalSeconds

> `readonly` **totalSeconds**: `number`

Total time in seconds including ms

***

### totalIntegerSeconds

> `readonly` **totalIntegerSeconds**: `number`

Total time in seconds without ms

***

### totalMilliseconds

> `readonly` **totalMilliseconds**: `number`

Total time in ms

***

### hours

> `readonly` **hours**: `number`

hours of the time

***

### minutes

> `readonly` **minutes**: `number`

minutes of the time

***

### seconds

> `readonly` **seconds**: `number`

seconds of the time

## Methods

### convertFrom()

> `static` **convertFrom**(`value`): [`Time`](Time.md)

Convert a value to a Time

#### Parameters

• **value**: `unknown`

Value can be converted from `string` or `number`. If `string`, it's parsed with the format `hh:mm:ss.ms`. If `number`, it's considered as a number of seconds.

#### Returns

[`Time`](Time.md)

***

### canConvertFrom()

> `static` **canConvertFrom**(`value`): `boolean`

Check if we can convert value to Time

#### Parameters

• **value**: `unknown`

#### Returns

`boolean`

***

### fromSeconds()

> `static` **fromSeconds**(`value`): [`Time`](Time.md)

Convert from seconds to time

#### Parameters

• **value**: `number`

#### Returns

[`Time`](Time.md)

***

### toString()

> **toString**(`withoutMilliseconds`): `string`

Convert time to string

#### Parameters

• **withoutMilliseconds**: `boolean` = `false`

show milliseconds in string result

#### Returns

`string`

#### Implementation of

[`IConvertibleType`](../interfaces/IConvertibleType.md).[`toString`](../interfaces/IConvertibleType.md#tostring)

***

### canConvertTo()

> **canConvertTo**(`type`): `boolean`

Check if the type can be converted

#### Parameters

• **type**: `unknown`

#### Returns

`boolean`

#### Implementation of

[`IConvertibleType`](../interfaces/IConvertibleType.md).[`canConvertTo`](../interfaces/IConvertibleType.md#canconvertto)

***

### convertTo()

> **convertTo**(`type`): `unknown`

Function to convert a Time to another type

#### Parameters

• **type**: `unknown`

#### Returns

`unknown`

#### Implementation of

[`IConvertibleType`](../interfaces/IConvertibleType.md).[`convertTo`](../interfaces/IConvertibleType.md#convertto)


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/