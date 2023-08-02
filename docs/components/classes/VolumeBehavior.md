# Class: VolumeBehavior

Behavior to manage the media volume (audio, video, ...).

## Table of contents

### Properties

- [mediaVolumeElement](VolumeBehavior.md#mediavolumeelement)
- [\_volume](VolumeBehavior.md#_volume)
- [showVolume](VolumeBehavior.md#showvolume)

### Methods

- [setVolume](VolumeBehavior.md#setvolume)
- [raiseVolumeChanged](VolumeBehavior.md#raisevolumechanged)

## Properties

### mediaVolumeElement

• **mediaVolumeElement**: [`PlayableMediaFacade`](PlayableMediaFacade.md) = `undefined`

Media with volume element

___

### \_volume

• **\_volume**: `number` = `0`

Current volume.

___

### showVolume

• **showVolume**: `boolean` = `false`

Show volume.

## Methods

### setVolume

▸ **setVolume**(`volume`): `void`

Set volume of the media.

#### Parameters

| Name | Type |
| :------ | :------ |
| `volume` | `number` |

#### Returns

`void`

___

### raiseVolumeChanged

▸ **raiseVolumeChanged**(): `void`

Volume changed

#### Returns

`void`
