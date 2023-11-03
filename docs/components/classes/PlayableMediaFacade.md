# Class: PlayableMediaFacade

Facade to use audio API.

## Implements

- `PlayableFacade`

## Table of contents

### Methods

- [getCurrentTime](PlayableMediaFacade.md#getcurrenttime)
- [setCurrentTime](PlayableMediaFacade.md#setcurrenttime)
- [getDuration](PlayableMediaFacade.md#getduration)
- [isPaused](PlayableMediaFacade.md#ispaused)
- [setVolume](PlayableMediaFacade.md#setvolume)
- [play](PlayableMediaFacade.md#play)
- [pause](PlayableMediaFacade.md#pause)
- [listenIsReadyEvent](PlayableMediaFacade.md#listenisreadyevent)
- [unlistenIsReadyEvent](PlayableMediaFacade.md#unlistenisreadyevent)
- [listenToSeekedEvent](PlayableMediaFacade.md#listentoseekedevent)
- [unlistenToSeekedEvent](PlayableMediaFacade.md#unlistentoseekedevent)
- [listenToEndedEvent](PlayableMediaFacade.md#listentoendedevent)
- [unlistenToEndedEvent](PlayableMediaFacade.md#unlistentoendedevent)

## Methods

### getCurrentTime

▸ **getCurrentTime**(): `number`

Get current time of the playable element.

#### Returns

`number`

#### Implementation of

PlayableFacade.getCurrentTime

___

### setCurrentTime

▸ **setCurrentTime**(`currentTime`): `void`

Set current time to the playable element.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `currentTime` | `number` | current time to set |

#### Returns

`void`

#### Implementation of

PlayableFacade.setCurrentTime

___

### getDuration

▸ **getDuration**(): `number`

Get duration of the playable element.

#### Returns

`number`

#### Implementation of

PlayableFacade.getDuration

___

### isPaused

▸ **isPaused**(): `boolean`

Return true if playable element is paused.

#### Returns

`boolean`

#### Implementation of

PlayableFacade.isPaused

___

### setVolume

▸ **setVolume**(`volume`): `void`

Change volume

#### Parameters

| Name | Type |
| :------ | :------ |
| `volume` | `number` |

#### Returns

`void`

___

### play

▸ **play**(): `void`

Play the playable element.

#### Returns

`void`

#### Implementation of

PlayableFacade.play

___

### pause

▸ **pause**(): `void`

Pause the playable element.

#### Returns

`void`

#### Implementation of

PlayableFacade.pause

___

### listenIsReadyEvent

▸ **listenIsReadyEvent**(`callback`): `void`

Listen playable ready event.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback` | [`Function`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function ) | callback to call when event is emited |

#### Returns

`void`

#### Implementation of

PlayableFacade.listenIsReadyEvent

___

### unlistenIsReadyEvent

▸ **unlistenIsReadyEvent**(`callback`): `void`

Unlisten playable ready event.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback` | [`Function`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function ) | callback to remove |

#### Returns

`void`

#### Implementation of

PlayableFacade.unlistenIsReadyEvent

___

### listenToSeekedEvent

▸ **listenToSeekedEvent**(`callback`): `void`

Listen to seeked event

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback` | [`Function`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function ) | callback to call |

#### Returns

`void`

___

### unlistenToSeekedEvent

▸ **unlistenToSeekedEvent**(`callback`): `void`

Unlisten to seeked event

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback` | [`Function`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function ) | callback to remove |

#### Returns

`void`

___

### listenToEndedEvent

▸ **listenToEndedEvent**(`callback`): `void`

Listen to ended event

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback` | [`Function`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function ) | callback to call when event is emitted |

#### Returns

`void`

#### Implementation of

PlayableFacade.listenToEndedEvent

___

### unlistenToEndedEvent

▸ **unlistenToEndedEvent**(`callback`): `void`

Unlisten to ended event.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback` | [`Function`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function ) | callback to remove |

#### Returns

`void`

#### Implementation of

PlayableFacade.unlistenToEndedEvent


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/