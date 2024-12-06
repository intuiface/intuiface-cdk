[**@intuiface/core**](../README.md) • **Docs**

***

# Class: UsbSerialService

Usb serial service to access to usb port, open it and write to it

## Methods

### ~~getInstance()~~

> `static` **getInstance**(): [`UsbSerialService`](UsbSerialService.md)

Get the instance of the usb serial service.

#### Returns

[`UsbSerialService`](UsbSerialService.md)

an instance of the usb serial service

#### Deprecated

Use the new [createInstance](UsbSerialService.md#createinstance) instead.

***

### createInstance()

> `static` **createInstance**(): [`UsbSerialService`](UsbSerialService.md)

Create an instance of the usb serial service.

#### Returns

[`UsbSerialService`](UsbSerialService.md)

an instance of the usb serial service

***

### list()

> **list**(`callback`): `void`

List all devices

#### Parameters

• **callback**: [`Function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

#### Returns

`void`

***

### open()

> **open**(`opts`, `callback`): `void`

Open the serial port

#### Parameters

• **opts**: `any`

:
{ port: string, pid: number, vid: number, driver: string,
baudRate: number, dataBits: number, stopBits: number, parity: number,
dtr: boolean, rts: boolean, sleepOnPause: boolean}

• **callback**: [`Function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

#### Returns

`void`

***

### write()

> **write**(`data`, `callback`): `void`

Write to the serial port

#### Parameters

• **data**: `string`

• **callback**: [`Function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

#### Returns

`void`

***

### close()

> **close**(`callback`): `void`

Close the serial port

#### Parameters

• **callback**: [`Function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

#### Returns

`void`

***

### registerReadCallback()

> **registerReadCallback**(`callbackToRegister`, `callback`): `void`

Close the serial port

#### Parameters

• **callbackToRegister**: [`Function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

• **callback**: [`Function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

#### Returns

`void`

***

### isConnected()

> **isConnected**(`callback`): `void`

Check if is connected

#### Parameters

• **callback**: [`Function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

#### Returns

`void`

***

### dispose()

> **dispose**(): `void`

Dispose

#### Returns

`void`


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/