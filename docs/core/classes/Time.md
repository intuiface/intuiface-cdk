# Class: Time

Time type

## Implements

- `IConvertibleType`

## Table of contents

### Constructors

- [constructor](Time.md#constructor)

### Properties

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

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |

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

IConvertibleType.toString

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

IConvertibleType.canConvertTo

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

IConvertibleType.convertTo
