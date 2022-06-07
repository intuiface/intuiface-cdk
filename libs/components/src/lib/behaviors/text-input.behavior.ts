import { Inject, IFont } from '@intuiface/core';
import { TextBehavior } from './text.behavior';

/**
 * Hide instruction behavior
 */
export enum HideInstructionBehavior {
    WhenEnterEditState = 'WhenEnterEditState',
    WhenCharacterIsTyped = 'WhenCharacterIsTyped'
}

/**
 * Keyboard layouts
 */
export enum KeyboardLayout {
    None = 'UNDEFINED',
    Alphanumeric = 'ALPHANUMERIC',
    Numpad = 'NUMPAD',
    Dualkeyboard = 'DUALKEYBOARD'
}

/**
 * Character type
 */
export enum CharacterType {
    Alphanumeric = 'Alphanumeric',
    Alphabetic = 'Alphabetic',
    Numeric = 'Numeric',
    Email = 'Email'
}

/**
 * Input type
 */
export enum InputType {
    Text = 'text',
    Number = 'number',
    Email = 'email'
}

/**
 * Regular expressions for text validation
 */
export enum RegexpText {
    Alphanumeric = '^(.*)$',
    Alphabetic = '^([^0-9]*)$',
    Numeric = '^([0-9\\.,]+)$',
    Email = '^([\\w\\.\\-\\&]+)@([\\w\\.\\-\\&]+)\\.([\\w\\.\\-\\&]+)$'
}

/**
 * Regular expressions for character validation
 */
export enum RegexpCharacter {
    Alphanumeric = '^.$',
    Alphabetic = '^[^0-9]$',
    Numeric = '^[0-9\\.,]$',
    Email = '^[\\w@\\.\\-\\&]$'
}

/**
 * Behavior to manage a text input.
 */
@Inject({
    behaviors: [TextBehavior]
})
export class TextInputBehavior
{
    //#region Properties

    /**
     * Text.
     */
    public text: string = '';

    /**
     * Fill color during edit mode.
     */
    public editFillColor = '#cfcfcf';

    /**
     * Outline color during edit mode.
     */
    public editOutlineColor = '#c6c7c8';

    /**
     * Outline thickness during edit mode.
     */
    public editOutlineThickness = 5;

    /**
     * Radius of the input during edit mode.
     */
    public editRadius: number = 0;

    /**
     * Text margin.
     */
    public textMargin: number = 4;

    /**
     * Caret color.
     */
    public caretColor = '#000000';

    /**
     * Selection area color.
     */
    public selectionAreaColor = '#595959';

    /**
     * Indicates line is wrap.
     */
    public isLineWrap = false;

    /**
     * Minimum characters number.
     */
    public minCharacterNumber = 0;

    /**
     * Maximum characters number.
     */
    public maxCharacterNumber = 500;

    /**
     * Instruction text.
     */
    public instructionText = '';

    /**
     * Instruction font.
     */
    public instructionFont: IFont;

    /**
     * Instruction font size.
     */
    public instructionFontSize = 25;

    /**
     * Instruction font color.
     */
    public instructionFontColor = '#858585';

    /**
     * Instruction bold.
     */
    public instructionBold = false;

    /**
     * Instruction italic.
     */
    public instructionItalic = true;

    /**
     * Hide instruction behavior.
     */
    public hideInstruction = HideInstructionBehavior.WhenEnterEditState;

    /**
     * Indicates if password mode is enabled.
     */
    public isPasswordModeEnabled = false;

    /**
     * Indicates the replacement char for password.
     */
    public passwordReplacementChar = '*';

    /**
     * Duration before to show replacement character in password mode.
     */
    public passwordReplacementCharDisplayTime = 2000;

    /**
     * Duration before to show replacement character in password mode.
     */
    public characterType: CharacterType = CharacterType.Alphanumeric;

    /**
     * Indicates if the text is validated.
     */
    public isTextValidated = false;

    /**
     * Indicates if we use cutom regex to validate this field.
     */
    public useCustomRegex = false;

    /**
     * Indicates the regex to validate this field.
     */
    public customCharacterTypeRegExp = '^([^0-9]*)$';

    /**
     * Indicates if we force, look Keyboard property.
     */
    public forceKeyboard = false;

    /**
     * Indicates if we use cutom regex to validate this field.
     */
    public keyboard = KeyboardLayout.None;

    //#endregion Properties

    //#region Internal Properties

    /**
     * Indicates the input text is focused
     */
    public isFocused = false;

    /**
     * Input type according to given character type
     */
    public inputType: InputType = InputType.Text;


    //#endregion Internal Properties

    //#region Triggers

    /**
     * Trigger when the enter key is pressed
     */
    public raiseEnterKeyPressed(): void { }

    /**
     * Trigger when a key is pressed
     */
    public raiseKeyPressed(keys: string): void { }

    /**
     * Trigger when start editing
     */
    public raiseStartEditing(): void { }

    /**
     * Trigger when stop editing
     */
    public raiseStopEditing(): void { }

    /**
     * Trigger when the text changed
     */
    public raiseTextChanged(firstParam: string, secondParam: string): void { }

    /**
     * Trigger when the text is validated
     */
    public raiseTextValidated(): void { }

    /**
     * Trigger when an invalid character is entered
     */
    public raiseInvalidCharacterEntered(): void { }

    /**
     * Trigger when an invalid text is entered
     */
    public raiseInvalidTextEntered(): void { }

    //#endregion Triggers

    //#region Actions

    /**
     * Enable font size adaptation.
     */
    public enableAdaptFontSize(): void
    {
    }

    /**
     * Disable font size adaptation.
     */
    public disableAdaptFontSize(): void
    {
    }

    /**
     * Toggle font size adaptation.
     */
    public toggleAdaptFontSize(): void
    {
    }

    /**
     * Empty text field.
     */
    public emptyField(): void
    {
    }

    /**
     * Set text.
     * @param text text to set
     */
    public changeText(text: string): void
    {
    }

    /**
     * Enter editing mode.
     */
    public startEdition(): void
    {
    }

    /**
     * Exit editing mode.
     */
    public stopEdition(): void
    {
    }

    /**
     * Set minimum size for font size adaptation.
     * @param size minimum font size
     */
    public setMinFontSize(size: number): void
    {
    }

    //#endregion Actions
}
export interface TextInputBehavior extends TextBehavior {}
