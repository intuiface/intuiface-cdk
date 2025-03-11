[**@intuiface/components**](../README.md) • **Docs**

***

# Class: TextBehavior

Behavior to manage a text.

## Extended by

- [`TextInputBehavior`](TextInputBehavior.md)

## Properties

### text

> **text**: `any`

Text.

***

### fontColor

> **fontColor**: `any`

Font color.

***

### fontSize

> **fontSize**: `any`

Font size.

***

### font

> **font**: `Typeface`

Font.

***

### minFontSize

> **minFontSize**: `any`

Minimum Font size.

***

### isBold

> **isBold**: `any`

Indicates text is bold.

***

### isItalic

> **isItalic**: `any`

Indicates text is italic.

***

### isUnderline

> **isUnderline**: `any`

Indicates text is underline.

***

### horizontalAlignment

> **horizontalAlignment**: `any`

Indicates horizontal text alignment.

***

### verticalAlignment

> **verticalAlignment**: `any`

Indicates vertical text alignment.

***

### isLineWrap

> **isLineWrap**: `any`

Indicates line is wrap.

***

### overflow

> **overflow**: `any`

Indicates text overflow.

***

### isAdaptFontSize

> **isAdaptFontSize**: `any`

Indicates text adapt font size.

***

### textMargin

> **textMargin**: `number` = `0`

Text margin.

***

### adaptedFontSize

> **adaptedFontSize**: `number`

Font size computed after font size algorithm

***

### heightAfterAdaptFontSize

> **heightAfterAdaptFontSize**: `number`

Text height computed after font size algorithm

## Methods

### changeFontColor()

> **changeFontColor**(`color`): `void`

Action to change the font color.

#### Parameters

• **color**: `string`

new font color to set

#### Returns

`void`

***

### changeFontSize()

> **changeFontSize**(`size`): `void`

Action to change the font size.

#### Parameters

• **size**: `number`

new font size to set

#### Returns

`void`

***

### changeText()

> **changeText**(`text`): `void`

Action to change the text.

#### Parameters

• **text**: `string`

new text to set

#### Returns

`void`

***

### changeFontStyle()

> **changeFontStyle**(`isBold`, `isItalic`, `isUnderline`, `isLineWrap`): `void`

Action to change the style.

#### Parameters

• **isBold**: `boolean`

true to bold

• **isItalic**: `boolean`

true to italic

• **isUnderline**: `boolean`

true to underline

• **isLineWrap**: `boolean`

true to line wrap

#### Returns

`void`

***

### changeFont()

> **changeFont**(`value`): `void`

Action to change the font.

#### Parameters

• **value**: `unknown`

#### Returns

`void`


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/