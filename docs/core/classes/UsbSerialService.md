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

> **list**(): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`[]\>

List all devices

#### Returns

[`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`[]\>

error

list of ports (USB0, USB1, ...)

***

### open()

> **open**(`opts`): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

Open the serial port

#### Parameters

• **opts**: `any`

:
{ port: string, pid: number, vid: number,
baudRate: number, dataBits: number, stopBits: number, parity: number,
dtr: boolean, rts: boolean, sleepOnPause: boolean}

#### Returns

[`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

error

result: a message telling if the port is opened or not

***

### write()

> **write**(`data`): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Write to the serial port

#### Parameters

• **data**: `string`

#### Returns

[`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

***

### close()

> **close**(): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Close the serial port

#### Returns

[`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

***

### registerReadCallback()

> **registerReadCallback**(`callbackToRegister`): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Register a callback to be called when data is received

#### Parameters

• **callbackToRegister**: [`Function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

#### Returns

[`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

***

### isConnected()

> **isConnected**(): [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`boolean`\>

Check if is connected

#### Returns

[`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`boolean`\>

isConnected

***

### dispose()

> **dispose**(): `void`

Dispose

#### Returns

`void`


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/