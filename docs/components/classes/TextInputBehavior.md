# Class: TextInputBehavior

Behavior to manage a text input.

## Hierarchy

- [`TextBehavior`](TextBehavior.md)

  ↳ **`TextInputBehavior`**

## Table of contents

### Properties

- [text](TextInputBehavior.md#text)
- [editFillColor](TextInputBehavior.md#editfillcolor)
- [editOutlineColor](TextInputBehavior.md#editoutlinecolor)
- [editOutlineThickness](TextInputBehavior.md#editoutlinethickness)
- [editRadius](TextInputBehavior.md#editradius)
- [textMargin](TextInputBehavior.md#textmargin)
- [caretColor](TextInputBehavior.md#caretcolor)
- [selectionAreaColor](TextInputBehavior.md#selectionareacolor)
- [isLineWrap](TextInputBehavior.md#islinewrap)
- [minCharacterNumber](TextInputBehavior.md#mincharacternumber)
- [maxCharacterNumber](TextInputBehavior.md#maxcharacternumber)
- [instructionText](TextInputBehavior.md#instructiontext)
- [instructionFont](TextInputBehavior.md#instructionfont)
- [instructionFontSize](TextInputBehavior.md#instructionfontsize)
- [instructionFontColor](TextInputBehavior.md#instructionfontcolor)
- [instructionBold](TextInputBehavior.md#instructionbold)
- [instructionItalic](TextInputBehavior.md#instructionitalic)
- [hideInstruction](TextInputBehavior.md#hideinstruction)
- [isPasswordModeEnabled](TextInputBehavior.md#ispasswordmodeenabled)
- [passwordReplacementChar](TextInputBehavior.md#passwordreplacementchar)
- [passwordReplacementCharDisplayTime](TextInputBehavior.md#passwordreplacementchardisplaytime)
- [characterType](TextInputBehavior.md#charactertype)
- [isTextValidated](TextInputBehavior.md#istextvalidated)
- [useCustomRegex](TextInputBehavior.md#usecustomregex)
- [customCharacterTypeRegExp](TextInputBehavior.md#customcharactertyperegexp)
- [forceKeyboard](TextInputBehavior.md#forcekeyboard)
- [keyboard](TextInputBehavior.md#keyboard)
- [isFocused](TextInputBehavior.md#isfocused)
- [inputType](TextInputBehavior.md#inputtype)
- [fontColor](TextInputBehavior.md#fontcolor)
- [fontSize](TextInputBehavior.md#fontsize)
- [font](TextInputBehavior.md#font)
- [minFontSize](TextInputBehavior.md#minfontsize)
- [isBold](TextInputBehavior.md#isbold)
- [isItalic](TextInputBehavior.md#isitalic)
- [isUnderline](TextInputBehavior.md#isunderline)
- [horizontalAlignment](TextInputBehavior.md#horizontalalignment)
- [verticalAlignment](TextInputBehavior.md#verticalalignment)
- [overflow](TextInputBehavior.md#overflow)
- [isAdaptFontSize](TextInputBehavior.md#isadaptfontsize)
- [adaptedFontSize](TextInputBehavior.md#adaptedfontsize)
- [heightAfterAdaptFontSize](TextInputBehavior.md#heightafteradaptfontsize)

### Methods

- [raiseEnterKeyPressed](TextInputBehavior.md#raiseenterkeypressed)
- [raiseKeyPressed](TextInputBehavior.md#raisekeypressed)
- [raiseStartEditing](TextInputBehavior.md#raisestartediting)
- [raiseStopEditing](TextInputBehavior.md#raisestopediting)
- [raiseTextChanged](TextInputBehavior.md#raisetextchanged)
- [raiseTextValidated](TextInputBehavior.md#raisetextvalidated)
- [raiseInvalidCharacterEntered](TextInputBehavior.md#raiseinvalidcharacterentered)
- [raiseInvalidTextEntered](TextInputBehavior.md#raiseinvalidtextentered)
- [enableAdaptFontSize](TextInputBehavior.md#enableadaptfontsize)
- [disableAdaptFontSize](TextInputBehavior.md#disableadaptfontsize)
- [toggleAdaptFontSize](TextInputBehavior.md#toggleadaptfontsize)
- [emptyField](TextInputBehavior.md#emptyfield)
- [changeText](TextInputBehavior.md#changetext)
- [startEdition](TextInputBehavior.md#startedition)
- [stopEdition](TextInputBehavior.md#stopedition)
- [setMinFontSize](TextInputBehavior.md#setminfontsize)
- [changeFontColor](TextInputBehavior.md#changefontcolor)
- [changeFontSize](TextInputBehavior.md#changefontsize)
- [changeFontStyle](TextInputBehavior.md#changefontstyle)
- [changeFont](TextInputBehavior.md#changefont)

## Properties

### text

• **text**: `string` = `''`

Text.

#### Inherited from

[TextBehavior](TextBehavior.md).[text](TextBehavior.md#text)

___

### editFillColor

• **editFillColor**: `string` = `'#cfcfcf'`

Fill color during edit mode.

___

### editOutlineColor

• **editOutlineColor**: `string` = `'#c6c7c8'`

Outline color during edit mode.

___

### editOutlineThickness

• **editOutlineThickness**: `number` = `5`

Outline thickness during edit mode.

___

### editRadius

• **editRadius**: `number` = `0`

Radius of the input during edit mode.

___

### textMargin

• **textMargin**: `number` = `4`

Text margin.

#### Inherited from

[TextBehavior](TextBehavior.md).[textMargin](TextBehavior.md#textmargin)

___

### caretColor

• **caretColor**: `string` = `'#000000'`

Caret color.

___

### selectionAreaColor

• **selectionAreaColor**: `string` = `'#595959'`

Selection area color.

___

### isLineWrap

• **isLineWrap**: `boolean` = `false`

Indicates line is wrap.

#### Inherited from

[TextBehavior](TextBehavior.md).[isLineWrap](TextBehavior.md#islinewrap)

___

### minCharacterNumber

• **minCharacterNumber**: `number` = `0`

Minimum characters number.

___

### maxCharacterNumber

• **maxCharacterNumber**: `number` = `500`

Maximum characters number.

___

### instructionText

• **instructionText**: `string` = `''`

Instruction text.

___

### instructionFont

• **instructionFont**: `Typeface`

Instruction font.

___

### instructionFontSize

• **instructionFontSize**: `number` = `25`

Instruction font size.

___

### instructionFontColor

• **instructionFontColor**: `string` = `'#858585'`

Instruction font color.

___

### instructionBold

• **instructionBold**: `boolean` = `false`

Instruction bold.

___

### instructionItalic

• **instructionItalic**: `boolean` = `true`

Instruction italic.

___

### hideInstruction

• **hideInstruction**: `HideInstructionBehavior` = `HideInstructionBehavior.WhenEnterEditState`

Hide instruction behavior.

___

### isPasswordModeEnabled

• **isPasswordModeEnabled**: `boolean` = `false`

Indicates if password mode is enabled.

___

### passwordReplacementChar

• **passwordReplacementChar**: `string` = `'*'`

Indicates the replacement char for password.

___

### passwordReplacementCharDisplayTime

• **passwordReplacementCharDisplayTime**: `number` = `2000`

Duration before to show replacement character in password mode.

___

### characterType

• **characterType**: `CharacterType` = `CharacterType.Alphanumeric`

Duration before to show replacement character in password mode.

___

### isTextValidated

• **isTextValidated**: `boolean` = `false`

Indicates if the text is validated.

___

### useCustomRegex

• **useCustomRegex**: `boolean` = `false`

Indicates if we use cutom regex to validate this field.

___

### customCharacterTypeRegExp

• **customCharacterTypeRegExp**: `string` = `'^([^0-9]*)$'`

Indicates the regex to validate this field.

___

### forceKeyboard

• **forceKeyboard**: `boolean` = `false`

Indicates if we force, look Keyboard property.

___

### keyboard

• **keyboard**: `KeyboardLayout` = `KeyboardLayout.None`

Indicates if we use cutom regex to validate this field.

___

### isFocused

• **isFocused**: `boolean` = `false`

Indicates the input text is focused

___

### inputType

• **inputType**: `InputType` = `InputType.Text`

Input type according to given character type

___

### fontColor

• **fontColor**: `any`

Font color.

#### Inherited from

[TextBehavior](TextBehavior.md).[fontColor](TextBehavior.md#fontcolor)

___

### fontSize

• **fontSize**: `any`

Font size.

#### Inherited from

[TextBehavior](TextBehavior.md).[fontSize](TextBehavior.md#fontsize)

___

### font

• **font**: `Typeface`

Font.

#### Inherited from

[TextBehavior](TextBehavior.md).[font](TextBehavior.md#font)

___

### minFontSize

• **minFontSize**: `any`

Minimum Font size.

#### Inherited from

[TextBehavior](TextBehavior.md).[minFontSize](TextBehavior.md#minfontsize)

___

### isBold

• **isBold**: `any`

Indicates text is bold.

#### Inherited from

[TextBehavior](TextBehavior.md).[isBold](TextBehavior.md#isbold)

___

### isItalic

• **isItalic**: `any`

Indicates text is italic.

#### Inherited from

[TextBehavior](TextBehavior.md).[isItalic](TextBehavior.md#isitalic)

___

### isUnderline

• **isUnderline**: `any`

Indicates text is underline.

#### Inherited from

[TextBehavior](TextBehavior.md).[isUnderline](TextBehavior.md#isunderline)

___

### horizontalAlignment

• **horizontalAlignment**: `any`

Indicates horizontal text alignment.

#### Inherited from

[TextBehavior](TextBehavior.md).[horizontalAlignment](TextBehavior.md#horizontalalignment)

___

### verticalAlignment

• **verticalAlignment**: `any`

Indicates vertical text alignment.

#### Inherited from

[TextBehavior](TextBehavior.md).[verticalAlignment](TextBehavior.md#verticalalignment)

___

### overflow

• **overflow**: `any`

Indicates text overflow.

#### Inherited from

[TextBehavior](TextBehavior.md).[overflow](TextBehavior.md#overflow)

___

### isAdaptFontSize

• **isAdaptFontSize**: `any`

Indicates text adapt font size.

#### Inherited from

[TextBehavior](TextBehavior.md).[isAdaptFontSize](TextBehavior.md#isadaptfontsize)

___

### adaptedFontSize

• **adaptedFontSize**: `number`

Font size computed after font size algorithm

#### Inherited from

[TextBehavior](TextBehavior.md).[adaptedFontSize](TextBehavior.md#adaptedfontsize)

___

### heightAfterAdaptFontSize

• **heightAfterAdaptFontSize**: `number`

Text height computed after font size algorithm

#### Inherited from

[TextBehavior](TextBehavior.md).[heightAfterAdaptFontSize](TextBehavior.md#heightafteradaptfontsize)

## Methods

### raiseEnterKeyPressed

▸ **raiseEnterKeyPressed**(): `void`

Trigger when the enter key is pressed

#### Returns

`void`

___

### raiseKeyPressed

▸ **raiseKeyPressed**(`keys`): `void`

Trigger when a key is pressed

#### Parameters

| Name | Type |
| :------ | :------ |
| `keys` | `string` |

#### Returns

`void`

___

### raiseStartEditing

▸ **raiseStartEditing**(): `void`

Trigger when start editing

#### Returns

`void`

___

### raiseStopEditing

▸ **raiseStopEditing**(): `void`

Trigger when stop editing

#### Returns

`void`

___

### raiseTextChanged

▸ **raiseTextChanged**(`firstParam`, `secondParam`): `void`

Trigger when the text changed

#### Parameters

| Name | Type |
| :------ | :------ |
| `firstParam` | `string` |
| `secondParam` | `string` |

#### Returns

`void`

___

### raiseTextValidated

▸ **raiseTextValidated**(): `void`

Trigger when the text is validated

#### Returns

`void`

___

### raiseInvalidCharacterEntered

▸ **raiseInvalidCharacterEntered**(): `void`

Trigger when an invalid character is entered

#### Returns

`void`

___

### raiseInvalidTextEntered

▸ **raiseInvalidTextEntered**(): `void`

Trigger when an invalid text is entered

#### Returns

`void`

___

### enableAdaptFontSize

▸ **enableAdaptFontSize**(): `void`

Enable font size adaptation.

#### Returns

`void`

___

### disableAdaptFontSize

▸ **disableAdaptFontSize**(): `void`

Disable font size adaptation.

#### Returns

`void`

___

### toggleAdaptFontSize

▸ **toggleAdaptFontSize**(): `void`

Toggle font size adaptation.

#### Returns

`void`

___

### emptyField

▸ **emptyField**(): `void`

Empty text field.

#### Returns

`void`

___

### changeText

▸ **changeText**(`text`): `void`

Set text.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `text` | `string` | text to set |

#### Returns

`void`

#### Inherited from

[TextBehavior](TextBehavior.md).[changeText](TextBehavior.md#changetext)

___

### startEdition

▸ **startEdition**(): `void`

Enter editing mode.

#### Returns

`void`

___

### stopEdition

▸ **stopEdition**(): `void`

Exit editing mode.

#### Returns

`void`

___

### setMinFontSize

▸ **setMinFontSize**(`size`): `void`

Set minimum size for font size adaptation.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `size` | `number` | minimum font size |

#### Returns

`void`

___

### changeFontColor

▸ **changeFontColor**(`color`): `void`

Action to change the font color.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `color` | `string` | new font color to set |

#### Returns

`void`

#### Inherited from

[TextBehavior](TextBehavior.md).[changeFontColor](TextBehavior.md#changefontcolor)

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

#### Inherited from

[TextBehavior](TextBehavior.md).[changeFontSize](TextBehavior.md#changefontsize)

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

#### Inherited from

[TextBehavior](TextBehavior.md).[changeFontStyle](TextBehavior.md#changefontstyle)

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

#### Inherited from

[TextBehavior](TextBehavior.md).[changeFont](TextBehavior.md#changefont)


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/