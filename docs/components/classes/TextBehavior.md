# Class: TextBehavior

Behavior to manage a text.

## Hierarchy

- **`TextBehavior`**

  ↳ [`TextInputBehavior`](TextInputBehavior.md)

## Table of contents

### Properties

- [text](TextBehavior.md#text)
- [fontColor](TextBehavior.md#fontcolor)
- [fontSize](TextBehavior.md#fontsize)
- [font](TextBehavior.md#font)
- [minFontSize](TextBehavior.md#minfontsize)
- [isBold](TextBehavior.md#isbold)
- [isItalic](TextBehavior.md#isitalic)
- [isUnderline](TextBehavior.md#isunderline)
- [horizontalAlignment](TextBehavior.md#horizontalalignment)
- [verticalAlignment](TextBehavior.md#verticalalignment)
- [isLineWrap](TextBehavior.md#islinewrap)
- [overflow](TextBehavior.md#overflow)
- [isAdaptFontSize](TextBehavior.md#isadaptfontsize)
- [textMargin](TextBehavior.md#textmargin)
- [adaptedFontSize](TextBehavior.md#adaptedfontsize)
- [heightAfterAdaptFontSize](TextBehavior.md#heightafteradaptfontsize)

### Methods

- [changeFontColor](TextBehavior.md#changefontcolor)
- [changeFontSize](TextBehavior.md#changefontsize)
- [changeText](TextBehavior.md#changetext)
- [changeFontStyle](TextBehavior.md#changefontstyle)
- [changeFont](TextBehavior.md#changefont)

## Properties

### text

• **text**: `any`

Text.

___

### fontColor

• **fontColor**: `any`

Font color.

___

### fontSize

• **fontSize**: `any`

Font size.

___

### font

• **font**: `Typeface`

Font.

___

### minFontSize

• **minFontSize**: `any`

Minimum Font size.

___

### isBold

• **isBold**: `any`

Indicates text is bold.

___

### isItalic

• **isItalic**: `any`

Indicates text is italic.

___

### isUnderline

• **isUnderline**: `any`

Indicates text is underline.

___

### horizontalAlignment

• **horizontalAlignment**: `any`

Indicates horizontal text alignment.

___

### verticalAlignment

• **verticalAlignment**: `any`

Indicates vertical text alignment.

___

### isLineWrap

• **isLineWrap**: `any`

Indicates line is wrap.

___

### overflow

• **overflow**: `any`

Indicates text overflow.

___

### isAdaptFontSize

• **isAdaptFontSize**: `any`

Indicates text adapt font size.

___

### textMargin

• **textMargin**: `number` = `0`

Text margin.

___

### adaptedFontSize

• **adaptedFontSize**: `number`

Font size computed after font size algorithm

___

### heightAfterAdaptFontSize

• **heightAfterAdaptFontSize**: `number`

Text height computed after font size algorithm

## Methods

### changeFontColor

▸ **changeFontColor**(`color`): `void`

Action to change the font color.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `color` | `string` | new font color to set |

#### Returns

`void`

___

### changeFontSize

▸ **changeFontSize**(`size`): `void`

Action to change the font size.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `size` | `number` | new font size to set |

#### Returns

`void`

___

### changeText

▸ **changeText**(`text`): `void`

Action to change the text.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `text` | `string` | new text to set |

#### Returns

`void`

___

### changeFontStyle

▸ **changeFontStyle**(`isBold`, `isItalic`, `isUnderline`, `isLineWrap`): `void`

Action to change the style.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `isBold` | `boolean` | true to bold |
| `isItalic` | `boolean` | true to italic |
| `isUnderline` | `boolean` | true to underline |
| `isLineWrap` | `boolean` | true to line wrap |

#### Returns

`void`

___

### changeFont

▸ **changeFont**(`value`): `void`

Action to change the font.

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `unknown` |

#### Returns

`void`


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/