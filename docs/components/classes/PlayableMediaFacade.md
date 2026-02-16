[**@intuiface/components**](../README.md)

***

# Class: PlayableMediaFacade

Facade to use audio API.

## Implements

- `PlayableFacade`

## Methods

### getCurrentTime()

> **getCurrentTime**(): `number`

Get current time of the playable element.

#### Returns

`number`

#### Implementation of

`PlayableFacade.getCurrentTime`

***

### setCurrentTime()

> **setCurrentTime**(`currentTime`): `void`

Set current time to the playable element.

#### Parameters

##### currentTime

`number`

current time to set

#### Returns

`void`

#### Implementation of

`PlayableFacade.setCurrentTime`

***

### getDuration()

> **getDuration**(): `number`

Get duration of the playable element.

#### Returns

`number`

#### Implementation of

`PlayableFacade.getDuration`

***

### isPaused()

> **isPaused**(): `boolean`

Return true if playable element is paused.

#### Returns

`boolean`

#### Implementation of

`PlayableFacade.isPaused`

***

### setVolume()

> **setVolume**(`volume`): `void`

Change volume

#### Parameters

##### volume

`number`

#### Returns

`void`

***

### play()

> **play**(): `void`

Play the playable element.

#### Returns

`void`

#### Implementation of

`PlayableFacade.play`

***

### pause()

> **pause**(): `void`

Pause the playable element.

#### Returns

`void`

#### Implementation of

`PlayableFacade.pause`

***

### listenIsReadyEvent()

> **listenIsReadyEvent**(`callback`): `void`

Listen playable ready event.

#### Parameters

##### callback

[`Function`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function)

callback to call when event is emited

#### Returns

`void`

#### Implementation of

`PlayableFacade.listenIsReadyEvent`

***

### unlistenIsReadyEvent()

> **unlistenIsReadyEvent**(`callback`): `void`

Unlisten playable ready event.

#### Parameters

##### callback

[`Function`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function)

callback to remove

#### Returns

`void`

#### Implementation of

`PlayableFacade.unlistenIsReadyEvent`

***

### listenToSeekedEvent()

> **listenToSeekedEvent**(`callback`): `void`

Listen to seeked event

#### Parameters

##### callback

[`Function`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function)

callback to call

#### Returns

`void`

***

### unlistenToSeekedEvent()

> **unlistenToSeekedEvent**(`callback`): `void`

Unlisten to seeked event

#### Parameters

##### callback

[`Function`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function)

callback to remove

#### Returns

`void`

***

### listenToEndedEvent()

> **listenToEndedEvent**(`callback`): `void`

Listen to ended event

#### Parameters

##### callback

[`Function`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function)

callback to call when event is emitted

#### Returns

`void`

#### Implementation of

`PlayableFacade.listenToEndedEvent`

***

### unlistenToEndedEvent()

> **unlistenToEndedEvent**(`callback`): `void`

Unlisten to ended event.

#### Parameters

##### callback

[`Function`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function)

callback to remove

#### Returns

`void`

#### Implementation of

`PlayableFacade.unlistenToEndedEvent`


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/