# Class: PlayableBehavior

Behavior to manage a playable media.

## Table of contents

### Properties

- [playableState](PlayableBehavior.md#playablestate)
- [currentTime](PlayableBehavior.md#currenttime)
- [duration](PlayableBehavior.md#duration)
- [speed](PlayableBehavior.md#speed)
- [isAutoplay](PlayableBehavior.md#isautoplay)
- [isAutoplayOnRewind](PlayableBehavior.md#isautoplayonrewind)
- [isLoop](PlayableBehavior.md#isloop)
- [showControls](PlayableBehavior.md#showcontrols)
- [showControlsBehavior](PlayableBehavior.md#showcontrolsbehavior)
- [playingIsActivity](PlayableBehavior.md#playingisactivity)
- [pauseWhenHidden](PlayableBehavior.md#pausewhenhidden)
- [playableElement](PlayableBehavior.md#playableelement)

### Methods

- [raisePlayRequested](PlayableBehavior.md#raiseplayrequested)
- [raisePauseRequested](PlayableBehavior.md#raisepauserequested)
- [raiseRewindRequested](PlayableBehavior.md#raiserewindrequested)
- [raiseLooped](PlayableBehavior.md#raiselooped)
- [raiseTimeReached](PlayableBehavior.md#raisetimereached)
- [raiseTimelineMoved](PlayableBehavior.md#raisetimelinemoved)
- [raiseEnded](PlayableBehavior.md#raiseended)
- [play](PlayableBehavior.md#play)
- [stop](PlayableBehavior.md#stop)
- [pause](PlayableBehavior.md#pause)
- [togglePlayPause](PlayableBehavior.md#toggleplaypause)
- [rewind](PlayableBehavior.md#rewind)
- [setTimeline](PlayableBehavior.md#settimeline)
- [turnOnAutoplay](PlayableBehavior.md#turnonautoplay)
- [turnOffAutoplay](PlayableBehavior.md#turnoffautoplay)
- [turnOnLoop](PlayableBehavior.md#turnonloop)
- [turnOffLoop](PlayableBehavior.md#turnoffloop)

## Properties

### playableState

• **playableState**: [`EPlayableState`](../enums/EPlayableState.md) = `EPlayableState.STOPPED`

State.

___

### currentTime

• **currentTime**: `Time` = `Time.Zero`

Current time.

___

### duration

• **duration**: `Time` = `Time.One`

Duration.

___

### speed

• **speed**: `number` = `1`

Speed.

___

### isAutoplay

• **isAutoplay**: `boolean` = `false`

Autoplay.

___

### isAutoplayOnRewind

• **isAutoplayOnRewind**: `boolean` = `true`

AutoplayOnRewind.

___

### isLoop

• **isLoop**: `boolean` = `false`

Loop.

___

### showControls

• **showControls**: `boolean` = `true`

Show controls.

___

### showControlsBehavior

• **showControlsBehavior**: `EShowControlsBehavior` = `EShowControlsBehavior.Temporary`

Show controls behavior.

___

### playingIsActivity

• **playingIsActivity**: `boolean` = `true`

Playing is activity

___

### pauseWhenHidden

• **pauseWhenHidden**: `boolean` = `true`

Pause when hidden

___

### playableElement

• **playableElement**: `PlayableFacade`

Playable element accessors.

## Methods

### raisePlayRequested

▸ **raisePlayRequested**(): `void`

Is played

#### Returns

`void`

___

### raisePauseRequested

▸ **raisePauseRequested**(): `void`

Is paused

#### Returns

`void`

___

### raiseRewindRequested

▸ **raiseRewindRequested**(): `void`

Is rewound

#### Returns

`void`

___

### raiseLooped

▸ **raiseLooped**(): `void`

Is looped

#### Returns

`void`

___

### raiseTimeReached

▸ **raiseTimeReached**(`time`): `void`

Time Changes

#### Parameters

| Name | Type |
| :------ | :------ |
| `time` | `Time` |

#### Returns

`void`

___

### raiseTimelineMoved

▸ **raiseTimelineMoved**(): `void`

Timeline moved

#### Returns

`void`

___

### raiseEnded

▸ **raiseEnded**(): `void`

Timeline moved

#### Returns

`void`

___

### play

▸ **play**(): `void`

Action to play the media.

#### Returns

`void`

___

### stop

▸ **stop**(): `void`

Action to stop the media.

#### Returns

`void`

___

### pause

▸ **pause**(): `void`

Pause the media.

#### Returns

`void`

___

### togglePlayPause

▸ **togglePlayPause**(): `void`

Toggle Play/Pause the media.

#### Returns

`void`

___

### rewind

▸ **rewind**(): `void`

Rewind the media.

#### Returns

`void`

___

### setTimeline

▸ **setTimeline**(`position`): `void`

Set current time in the media.

#### Parameters

| Name | Type |
| :------ | :------ |
| `position` | `Time` |

#### Returns

`void`

___

### turnOnAutoplay

▸ **turnOnAutoplay**(): `void`

Turn on autoplay.

#### Returns

`void`

___

### turnOffAutoplay

▸ **turnOffAutoplay**(): `void`

Turn off autoplay.

#### Returns

`void`

___

### turnOnLoop

▸ **turnOnLoop**(): `void`

Turn on loop.

#### Returns

`void`

___

### turnOffLoop

▸ **turnOffLoop**(): `void`

Turn off loop.

#### Returns

`void`
