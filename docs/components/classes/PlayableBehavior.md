[**@intuiface/components**](../README.md)

***

# Class: PlayableBehavior

Behavior to manage a playable media.

## Properties

### playableState

> **playableState**: [`EPlayableState`](../enumerations/EPlayableState.md) = `EPlayableState.STOPPED`

State.

***

### currentTime

> **currentTime**: `Time` = `Time.ZERO`

Current time.

***

### duration

> **duration**: `Time` = `Time.ONE`

Duration.

***

### speed

> **speed**: `number` = `1`

Speed.

***

### isAutoplay

> **isAutoplay**: `boolean` = `false`

Autoplay.

***

### isAutoplayOnRewind

> **isAutoplayOnRewind**: `boolean` = `true`

AutoplayOnRewind.

***

### isLoop

> **isLoop**: `boolean` = `false`

Loop.

***

### showControls

> **showControls**: `boolean` = `true`

Show controls.

***

### showControlsBehavior

> **showControlsBehavior**: `EShowControlsBehavior` = `EShowControlsBehavior.Temporary`

Show controls behavior.

***

### playingIsActivity

> **playingIsActivity**: `boolean` = `true`

Playing is activity

***

### pauseWhenHidden

> **pauseWhenHidden**: `boolean` = `true`

Pause when hidden

***

### playableElement

> **playableElement**: `PlayableFacade`

Playable element accessors.

## Methods

### raisePlayRequested()

> **raisePlayRequested**(): `void`

Is played

#### Returns

`void`

***

### raisePauseRequested()

> **raisePauseRequested**(): `void`

Is paused

#### Returns

`void`

***

### raiseRewindRequested()

> **raiseRewindRequested**(): `void`

Is rewound

#### Returns

`void`

***

### raiseLooped()

> **raiseLooped**(): `void`

Is looped

#### Returns

`void`

***

### raiseTimeReached()

> **raiseTimeReached**(`time`): `void`

Time Changes

#### Parameters

##### time

`Time`

#### Returns

`void`

***

### raiseTimelineMoved()

> **raiseTimelineMoved**(): `void`

Timeline moved

#### Returns

`void`

***

### raiseEnded()

> **raiseEnded**(): `void`

Timeline moved

#### Returns

`void`

***

### play()

> **play**(): `void`

Action to play the media.

#### Returns

`void`

***

### stop()

> **stop**(): `void`

Action to stop the media.

#### Returns

`void`

***

### pause()

> **pause**(): `void`

Pause the media.

#### Returns

`void`

***

### togglePlayPause()

> **togglePlayPause**(): `void`

Toggle Play/Pause the media.

#### Returns

`void`

***

### rewind()

> **rewind**(): `void`

Rewind the media.

#### Returns

`void`

***

### setTimeline()

> **setTimeline**(`position`): `void`

Set current time in the media.

#### Parameters

##### position

`Time`

#### Returns

`void`

***

### turnOnAutoplay()

> **turnOnAutoplay**(): `void`

Turn on autoplay.

#### Returns

`void`

***

### turnOffAutoplay()

> **turnOffAutoplay**(): `void`

Turn off autoplay.

#### Returns

`void`

***

### turnOnLoop()

> **turnOnLoop**(): `void`

Turn on loop.

#### Returns

`void`

***

### turnOffLoop()

> **turnOffLoop**(): `void`

Turn off loop.

#### Returns

`void`


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/