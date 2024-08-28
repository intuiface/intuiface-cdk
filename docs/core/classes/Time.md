# Class: Time

Class to use to describe a time duration.

**`Example`**

```ts
@Property({
    displayName: 'Remaining time',
    description: 'Remaining time before the end.',
    defaultValue: Time.Zero,
    type: Time
})
public remainingTime: Time;
```

## Implements

- [`IConvertibleType`](../interfaces/IConvertibleType.md)

## Table of contents

### Constructors

- [constructor](Time.md#constructor)

### Properties

- [Zero](Time.md#zero)
- [One](Time.md#one)
- [strTime](Time.md#strtime)
- [strTimeWithoutMilliseconds](Time.md#strtimewithoutmilliseconds)
- [totalSeconds](Time.md#totalseconds)
- [totalIntegerSeconds](Time.md#totalintegerseconds)
- [totalMilliseconds](Time.md#totalmilliseconds)
- [hours](Time.md#hours)
- [minutes](Time.md#minutes)
- [seconds](Time.md#seconds)

### Methods

- [convertFrom](Time.md#convertfrom)
- [canConvertFrom](Time.md#canconvertfrom)
- [fromSeconds](Time.md#fromseconds)
- [toString](Time.md#tostring)
- [canConvertTo](Time.md#canconvertto)
- [convertTo](Time.md#convertto)

## Constructors

### constructor

• **new Time**(`hours`, `minutes`, `seconds`)

Create a new time with given hours, minutes and seconds.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hours` | `number` | hours of the time |
| `minutes` | `number` | minutes of the time |
| `seconds` | `number` | seconds of the time |

## Properties

### Zero

▪ `Static` `Readonly` **Zero**: [`Time`](Time.md)

Instance of time representing an empty duration of zero.

___

### One

▪ `Static` `Readonly` **One**: [`Time`](Time.md)

Instance of time representing a duration of 1 second.

___

### strTime

• `Readonly` **strTime**: `string`

Time in string format

___

### strTimeWithoutMilliseconds

• `Readonly` **strTimeWithoutMilliseconds**: `string`

Time in string format without milliseconds

___

### totalSeconds

• `Readonly` **totalSeconds**: `number`

Total time in seconds including ms

___

### totalIntegerSeconds

• `Readonly` **totalIntegerSeconds**: `number`

Total time in seconds without ms

___

### totalMilliseconds

• `Readonly` **totalMilliseconds**: `number`

Total time in ms

___

### hours

• `Readonly` **hours**: `number`

hours of the time

___

### minutes

• `Readonly` **minutes**: `number`

minutes of the time

___

### seconds

• `Readonly` **seconds**: `number`

seconds of the time

## Methods

### convertFrom

▸ `Static` **convertFrom**(`value`): [`Time`](Time.md)

Convert a value to a Time

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `unknown` | Value can be converted from `string` or `number`. If `string`, it's parsed with the format `hh:mm:ss.ms`. If `number`, it's considered as a number of seconds. |

#### Returns

[`Time`](Time.md)

___

### canConvertFrom

▸ `Static` **canConvertFrom**(`value`): `boolean`

Check if we can convert value to Time

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |

#### Returns

`boolean`

___

### fromSeconds

▸ `Static` **fromSeconds**(`value`): [`Time`](Time.md)

Convert from seconds to time

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

[`Time`](Time.md)

___

### toString

▸ **toString**(`withoutMilliseconds?`): `string`

Convert time to string

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `withoutMilliseconds` | `boolean` | `false` | show milliseconds in string result |

#### Returns

`string`

#### Implementation of

[IConvertibleType](../interfaces/IConvertibleType.md).[toString](../interfaces/IConvertibleType.md#tostring)

___

### canConvertTo

▸ **canConvertTo**(`type`): `boolean`

Check if the type can be converted

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `unknown` |

#### Returns

`boolean`

#### Implementation of

[IConvertibleType](../interfaces/IConvertibleType.md).[canConvertTo](../interfaces/IConvertibleType.md#canconvertto)

___

### convertTo

▸ **convertTo**(`type`): `unknown`

Function to convert a Time to another type

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `unknown` |

#### Returns

`unknown`

#### Implementation of

[IConvertibleType](../interfaces/IConvertibleType.md).[convertTo](../interfaces/IConvertibleType.md#convertto)


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/