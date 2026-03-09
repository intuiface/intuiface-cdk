[**@intuiface/core**](../README.md)

***

# Class: SystemInfoService

Service to get system information (device id, device name ...etc)

## Methods

### getInstance()

> `static` **getInstance**(): `SystemInfoService`

Get the instance of the system info service.
You have to call this method to be able to call other methods to get system information.
```ts
await SystemInfoService.getInstance().getPlatform()
```

#### Returns

`SystemInfoService`

an instance of the system info service

***

### getDeviceId()

> **getDeviceId**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

Get the unique ID of the device

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

Device ID

***

### getDeviceName()

> **getDeviceName**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

Get the device name

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

the device name

***

### getPlatform()

> **getPlatform**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

Get the platform (ios, android or web)

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

platform

***

### getOS()

> **getOS**(): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

Get OS

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

Operating system and os version in same string

***

### getApplicationName()

> **getApplicationName**(): `string`

Get the application name

#### Returns

`string`

application name


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/