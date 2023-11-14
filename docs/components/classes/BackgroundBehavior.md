# Class: BackgroundBehavior

Background behavior: can be a color, an image or a video.

## Table of contents

### Properties

- [backgroundType](BackgroundBehavior.md#backgroundtype)
- [backgroundColor](BackgroundBehavior.md#backgroundcolor)
- [backgroundImage](BackgroundBehavior.md#backgroundimage)
- [backgroundVideo](BackgroundBehavior.md#backgroundvideo)
- [outlineColor](BackgroundBehavior.md#outlinecolor)
- [outlineThickness](BackgroundBehavior.md#outlinethickness)
- [radius](BackgroundBehavior.md#radius)
- [displayShadow](BackgroundBehavior.md#displayshadow)

### Methods

- [changeBackgroundColor](BackgroundBehavior.md#changebackgroundcolor)
- [changeOutlineColor](BackgroundBehavior.md#changeoutlinecolor)
- [changeOutlineThickness](BackgroundBehavior.md#changeoutlinethickness)

## Properties

### backgroundType

• **backgroundType**: [`EBackgroundType`](../enums/EBackgroundType.md) = `EBackgroundType.Color`

BackgroundType.

___

### backgroundColor

• **backgroundColor**: `SolidColor` = `SolidColor.Black`

BackgroundColor.

___

### backgroundImage

• **backgroundImage**: `string` = `'assets/defaultAssets/DefaultImage.png'`

BackgroundImage.

___

### backgroundVideo

• **backgroundVideo**: `string` = `'assets/defaultAssets/DefaultVideo.mp4'`

BackgroundVideo.

___

### outlineColor

• **outlineColor**: `SolidColor` = `SolidColor.Black`

Outline color.

___

### outlineThickness

• **outlineThickness**: `number` = `0`

Outline thickness.

___

### radius

• **radius**: `number` = `0`

Radius

___

### displayShadow

• **displayShadow**: `boolean` = `false`

Box shadow.

## Methods

### changeBackgroundColor

▸ **changeBackgroundColor**(`color`): `void`

Action to change the background color.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `color` | `Color` | new background color to set |

#### Returns

`void`

___

### changeOutlineColor

▸ **changeOutlineColor**(`color`): `void`

Action to change the outline color.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `color` | `Color` | new outline color to set |

#### Returns

`void`

___

### changeOutlineThickness

▸ **changeOutlineThickness**(`thickness`): `void`

Action to change the outline thickness.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `thickness` | `number` | new outline thickness to set |

#### Returns

`void`


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/