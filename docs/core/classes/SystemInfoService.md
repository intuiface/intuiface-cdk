# Class: SystemInfoService

Service to get system information (device id, device name ...etc)

## Table of contents

### Methods

- [getDeviceId](SystemInfoService.md#getdeviceid)
- [getDeviceName](SystemInfoService.md#getdevicename)
- [getPlatform](SystemInfoService.md#getplatform)
- [getOS](SystemInfoService.md#getos)
- [getApplicationName](SystemInfoService.md#getapplicationname)

## Methods

### getDeviceId

▸ **getDeviceId**(): `Promise`<`string`\>

Get the unique ID of the device

#### Returns

`Promise`<`string`\>

Device ID

___

### getDeviceName

▸ **getDeviceName**(): `Promise`<`string`\>

Get the device name

#### Returns

`Promise`<`string`\>

the device name

___

### getPlatform

▸ **getPlatform**(): `string`

Get the platform (ios, android or web)

#### Returns

`string`

platform

___

### getOS

▸ **getOS**(): `Promise`<`string`\>

Get OS

#### Returns

`Promise`<`string`\>

Operating system and os version in same string

___

### getApplicationName

▸ **getApplicationName**(): `string`

Get the application name

#### Returns

`string`

application name
