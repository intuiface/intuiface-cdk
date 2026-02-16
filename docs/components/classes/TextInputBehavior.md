[**@intuiface/components**](../README.md)

***

# Class: TextInputBehavior

Behavior to manage a text input.

## Extends

- [`TextBehavior`](TextBehavior.md)

## Properties

### text

> **text**: `string` = `''`

Text.

#### Inherited from

[`TextBehavior`](TextBehavior.md).[`text`](TextBehavior.md#text)

***

### editFillColor

> **editFillColor**: `string` = `'#cfcfcf'`

Fill color during edit mode.

***

### editOutlineColor

> **editOutlineColor**: `string` = `'#c6c7c8'`

Outline color during edit mode.

***

### editOutlineThickness

> **editOutlineThickness**: `number` = `5`

Outline thickness during edit mode.

***

### editRadius

> **editRadius**: `number` = `0`

Radius of the input during edit mode.

***

### textMargin

> **textMargin**: `number` = `4`

Text margin.

#### Inherited from

[`TextBehavior`](TextBehavior.md).[`textMargin`](TextBehavior.md#textmargin)

***

### caretColor

> **caretColor**: `string` = `'#000000'`

Caret color.

***

### selectionAreaColor

> **selectionAreaColor**: `string` = `'#595959'`

Selection area color.

***

### isLineWrap

> **isLineWrap**: `boolean` = `false`

Indicates line is wrap.

#### Inherited from

[`TextBehavior`](TextBehavior.md).[`isLineWrap`](TextBehavior.md#islinewrap)

***

### minCharacterNumber

> **minCharacterNumber**: `number` = `0`

Minimum characters number.

***

### maxCharacterNumber

> **maxCharacterNumber**: `number` = `500`

Maximum characters number.

***

### instructionText

> **instructionText**: `string` = `''`

Instruction text.

***

### instructionFont

> **instructionFont**: `Typeface`

Instruction font.

***

### instructionFontSize

> **instructionFontSize**: `number` = `25`

Instruction font size.

***

### instructionFontColor

> **instructionFontColor**: `string` = `'#858585'`

Instruction font color.

***

### instructionBold

> **instructionBold**: `boolean` = `false`

Instruction bold.

***

### instructionItalic

> **instructionItalic**: `boolean` = `true`

Instruction italic.

***

### hideInstruction

> **hideInstruction**: `HideInstructionBehavior` = `HideInstructionBehavior.WhenEnterEditState`

Hide instruction behavior.

***

### isPasswordModeEnabled

> **isPasswordModeEnabled**: `boolean` = `false`

Indicates if password mode is enabled.

***

### passwordReplacementChar

> **passwordReplacementChar**: `string` = `'*'`

Indicates the replacement char for password.

***

### passwordReplacementCharDisplayTime

> **passwordReplacementCharDisplayTime**: `number` = `2000`

Duration before to show replacement character in password mode.

***

### characterType

> **characterType**: `CharacterType` = `CharacterType.Alphanumeric`

Duration before to show replacement character in password mode.

***

### isTextValidated

> **isTextValidated**: `boolean` = `false`

Indicates if the text is validated.

***

### useCustomRegex

> **useCustomRegex**: `boolean` = `false`

Indicates if we use cutom regex to validate this field.

***

### customCharacterTypeRegExp

> **customCharacterTypeRegExp**: `string` = `'^([^0-9]*)$'`

Indicates the regex to validate this field.

***

### forceKeyboard

> **forceKeyboard**: `boolean` = `false`

Indicates if we force, look Keyboard property.

***

### keyboard

> **keyboard**: `KeyboardLayout` = `KeyboardLayout.None`

Indicates if we use cutom regex to validate this field.

***

### isFocused

> **isFocused**: `boolean` = `false`

Indicates the input text is focused

***

### inputType

> **inputType**: `InputType` = `InputType.Text`

Input type according to given character type

***

### fontColor

> **fontColor**: `any`

Font color.

#### Inherited from

[`TextBehavior`](TextBehavior.md).[`fontColor`](TextBehavior.md#fontcolor)

***

### fontSize

> **fontSize**: `any`

Font size.

#### Inherited from

[`TextBehavior`](TextBehavior.md).[`fontSize`](TextBehavior.md#fontsize)

***

### font

> **font**: `Typeface`

Font.

#### Inherited from

[`TextBehavior`](TextBehavior.md).[`font`](TextBehavior.md#font)

***

### minFontSize

> **minFontSize**: `any`

Minimum Font size.

#### Inherited from

[`TextBehavior`](TextBehavior.md).[`minFontSize`](TextBehavior.md#minfontsize)

***

### isBold

> **isBold**: `any`

Indicates text is bold.

#### Inherited from

[`TextBehavior`](TextBehavior.md).[`isBold`](TextBehavior.md#isbold)

***

### isItalic

> **isItalic**: `any`

Indicates text is italic.

#### Inherited from

[`TextBehavior`](TextBehavior.md).[`isItalic`](TextBehavior.md#isitalic)

***

### isUnderline

> **isUnderline**: `any`

Indicates text is underline.

#### Inherited from

[`TextBehavior`](TextBehavior.md).[`isUnderline`](TextBehavior.md#isunderline)

***

### horizontalAlignment

> **horizontalAlignment**: `any`

Indicates horizontal text alignment.

#### Inherited from

[`TextBehavior`](TextBehavior.md).[`horizontalAlignment`](TextBehavior.md#horizontalalignment)

***

### verticalAlignment

> **verticalAlignment**: `any`

Indicates vertical text alignment.

#### Inherited from

[`TextBehavior`](TextBehavior.md).[`verticalAlignment`](TextBehavior.md#verticalalignment)

***

### overflow

> **overflow**: `any`

Indicates text overflow.

#### Inherited from

[`TextBehavior`](TextBehavior.md).[`overflow`](TextBehavior.md#overflow)

***

### isAdaptFontSize

> **isAdaptFontSize**: `any`

Indicates text adapt font size.

#### Inherited from

[`TextBehavior`](TextBehavior.md).[`isAdaptFontSize`](TextBehavior.md#isadaptfontsize)

***

### adaptedFontSize

> **adaptedFontSize**: `number`

Font size computed after font size algorithm

#### Inherited from

[`TextBehavior`](TextBehavior.md).[`adaptedFontSize`](TextBehavior.md#adaptedfontsize)

***

### heightAfterAdaptFontSize

> **heightAfterAdaptFontSize**: `number`

Text height computed after font size algorithm

#### Inherited from

[`TextBehavior`](TextBehavior.md).[`heightAfterAdaptFontSize`](TextBehavior.md#heightafteradaptfontsize)

## Methods

### raiseEnterKeyPressed()

> **raiseEnterKeyPressed**(): `void`

Trigger when the enter key is pressed

#### Returns

`void`

***

### raiseKeyPressed()

> **raiseKeyPressed**(`keys`): `void`

Trigger when a key is pressed

#### Parameters

##### keys

`string`

#### Returns

`void`

***

### raiseStartEditing()

> **raiseStartEditing**(): `void`

Trigger when start editing

#### Returns

`void`

***

### raiseStopEditing()

> **raiseStopEditing**(): `void`

Trigger when stop editing

#### Returns

`void`

***

### raiseTextChanged()

> **raiseTextChanged**(`firstParam`, `secondParam`): `void`

Trigger when the text changed

#### Parameters

##### firstParam

`string`

##### secondParam

`string`

#### Returns

`void`

***

### raiseTextValidated()

> **raiseTextValidated**(): `void`

Trigger when the text is validated

#### Returns

`void`

***

### raiseInvalidCharacterEntered()

> **raiseInvalidCharacterEntered**(): `void`

Trigger when an invalid character is entered

#### Returns

`void`

***

### raiseInvalidTextEntered()

> **raiseInvalidTextEntered**(): `void`

Trigger when an invalid text is entered

#### Returns

`void`

***

### enableAdaptFontSize()

> **enableAdaptFontSize**(): `void`

Enable font size adaptation.

#### Returns

`void`

***

### disableAdaptFontSize()

> **disableAdaptFontSize**(): `void`

Disable font size adaptation.

#### Returns

`void`

***

### toggleAdaptFontSize()

> **toggleAdaptFontSize**(): `void`

Toggle font size adaptation.

#### Returns

`void`

***

### emptyField()

> **emptyField**(): `void`

Empty text field.

#### Returns

`void`

***

### changeText()

> **changeText**(`text`): `void`

Set text.

#### Parameters

##### text

`string`

text to set

#### Returns

`void`

#### Inherited from

[`TextBehavior`](TextBehavior.md).[`changeText`](TextBehavior.md#changetext)

***

### startEdition()

> **startEdition**(): `void`

Enter editing mode.

#### Returns

`void`

***

### stopEdition()

> **stopEdition**(): `void`

Exit editing mode.

#### Returns

`void`

***

### setMinFontSize()

> **setMinFontSize**(`size`): `void`

Set minimum size for font size adaptation.

#### Parameters

##### size

`number`

minimum font size

#### Returns

`void`

***

### changeFontColor()

> **changeFontColor**(`color`): `void`

Action to change the font color.

#### Parameters

##### color

`string`

new font color to set

#### Returns

`void`

#### Inherited from

[`TextBehavior`](TextBehavior.md).[`changeFontColor`](TextBehavior.md#changefontcolor)

***

### changeFontSize()

> **changeFontSize**(`size`): `void`

Action to change the font size.

#### Parameters

##### size

`number`

new font size to set

#### Returns

`void`

#### Inherited from

[`TextBehavior`](TextBehavior.md).[`changeFontSize`](TextBehavior.md#changefontsize)

***

### changeFontStyle()

> **changeFontStyle**(`isBold`, `isItalic`, `isUnderline`, `isLineWrap`): `void`

Action to change the style.

#### Parameters

##### isBold

`boolean`

true to bold

##### isItalic

`boolean`

true to italic

##### isUnderline

`boolean`

true to underline

##### isLineWrap

`boolean`

true to line wrap

#### Returns

`void`

#### Inherited from

[`TextBehavior`](TextBehavior.md).[`changeFontStyle`](TextBehavior.md#changefontstyle)

***

### changeFont()

> **changeFont**(`value`): `void`

Action to change the font.

#### Parameters

##### value

`unknown`

#### Returns

`void`

#### Inherited from

[`TextBehavior`](TextBehavior.md).[`changeFont`](TextBehavior.md#changefont)


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/