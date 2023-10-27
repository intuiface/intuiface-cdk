# Class: UsbSerialService

Usb serial service to access to usb port, open it and write to it

## Table of contents

### Methods

- [getInstance](UsbSerialService.md#getinstance)
- [list](UsbSerialService.md#list)
- [open](UsbSerialService.md#open)
- [write](UsbSerialService.md#write)
- [close](UsbSerialService.md#close)
- [registerReadCallback](UsbSerialService.md#registerreadcallback)
- [isConnected](UsbSerialService.md#isconnected)
- [dispose](UsbSerialService.md#dispose)

## Methods

### getInstance

▸ `Static` **getInstance**(): `any`

Get instance

#### Returns

`any`

___

### list

▸ **list**(`callback`): `void`

List all devices

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | [`Function`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function ) |

#### Returns

`void`

___

### open

▸ **open**(`opts`, `callback`): `void`

Open the serial port

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | `any` | : { port: string, pid: number, vid: number, driver: string, baudRate: number, dataBits: number, stopBits: number, parity: number, dtr: boolean, rts: boolean, sleepOnPause: boolean} |
| `callback` | [`Function`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function ) |  |

#### Returns

`void`

___

### write

▸ **write**(`data`, `callback`): `void`

Write to the serial port

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `string` |
| `callback` | [`Function`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function ) |

#### Returns

`void`

___

### close

▸ **close**(`callback`): `void`

Close the serial port

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | [`Function`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function ) |

#### Returns

`void`

___

### registerReadCallback

▸ **registerReadCallback**(`callbackToRegister`, `callback`): `void`

Close the serial port

#### Parameters

| Name | Type |
| :------ | :------ |
| `callbackToRegister` | [`Function`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function ) |
| `callback` | [`Function`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function ) |

#### Returns

`void`

___

### isConnected

▸ **isConnected**(`callback`): `void`

Check if is connected

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | [`Function`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function ) |

#### Returns

`void`

___

### dispose

▸ **dispose**(): `void`

Dispose

#### Returns

`void`


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/