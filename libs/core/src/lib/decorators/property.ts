/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { getTypeAndFormat } from '../types/convertible.type';

/**
 * Options used to configure {@link Property | `@Property`} decorator
 */
export interface IPropertyOptions
{
    /**
     * Name of the property displayed in Composer.
     */
    displayName: string;

    /**
     * Description of the property displayed in Composer.
     */
    description?: string;

    /**
     * Default value of the property.
     */
    defaultValue?: any;

    /**
     * Minimum value for this property.  
     * If specified, any number value smaller than this value will be ignored when and replaced by the minimum.
     */
    minValue?: number;

    /**
     * Maximum value for this property.  
     * If specified, any number value greater than this value will be ignored when and replaced by the maximum.
     */
    maxValue?: number;

    /**
     * True if property is read only in Intuiface Composer. The property will only be usable as a binding source.
     */
    readOnly?: boolean;

    /**
     * The type of the property.
     * It's optional but highly recommended for better binding conversion.
     * It can be:
     * - `String`
     * - `Number`
     * - `Boolean`
     * - `Array`
     * - Class name of a {@link IConvertibleType | convertible type} (`Color`, `Font`, `Path`, `Resource`, `Time`)
     * - Enum type
     * - Class name of another class you created
     */
    type?: any;

    /**
     * The item type in case the type is `Array`.
     * It's optional but useful in interface assets to display item's properties in Intuiface Composer.
     * It can be:
     *  - Class name
     *  - `String`
     *  - `Number`
     *  - `Boolean`
     */
    itemType?: any;
}

/**
 * The `@Property` decorator enable you to declare a Property on your asset that can be used in a Intuiface experience.
 * @param options options of the property (display name, description, ...)
 *
 * @example ```ts
 * @Property({
 *     displayName: 'Volume', // 'Volume' is the name of the property
 *     description: 'Current volume in the media.', // here the description of the property
 *     defaultValue: 1, // the default value of the property : 1
 *     minValue: 0, // the minimum value : 0
 *     maxValue: 1, // the maximum value : 1
 *     type: Number // the property is a number (so binding on a text with '0.5' value will be converted in a number value 0.5)
 * })
 * public volume: number = 0; // declaration of the property
 * ```
 * _**Note**_: the name `volume` is in camelCase as the naming convention.
 *
 * ❗⚠️⚠️⚠️⚠️❗For property type `Array` there is a limitation: if you modify the array with methods like `push`, `pop`, `reduce`, `reverse`, `shift`, `sort`, `splice`... without calling a setter (e.g. `this.myArray = [...]`) bindings will not be updated. To fix that, you can use the method {@link Watchable.notifyPropertyChanged}.
 * @example I have an item list declared like this:
 * ```ts
 * /**
 *  * Item List
 *  *\/
 * @Property({
 *     displayName: 'List Items',
 *     defaultValue: [],
 *     type: Array,
 *     itemType: ListItem
 * })
 * public listItems: ListItem[] = [];
 * ```
 * I have an action which adds an item to the list using the `push` method. I have to add this code to be sure all my bindings will be resolved when I add a new item:
 * ```ts
 * // add my new item to the list
 * this.listItems.push(newItem);
 * // call the notify property changed
 * this.notifyPropertyChanged('listItems', this.listItems);
 * ```
 * Also the item class should extends {@link Watchable} and have the decorator {@link Asset}:
 * ```ts
 * @Asset({
 *  name: 'ListItem',
 *  behaviors: []
 * }))
 * export class ListItem extends Watchable
 * {
 *      // Declare here properties for this class 
 * }
 * ```
 *
 * @group Decorators
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function Property(options?: IPropertyOptions)
{
    return (target: any, propertyKey: string): void =>
    {
        // get target name
        const targetName = target.constructor.name;

        // manage property declared with _ 
        if (propertyKey.startsWith('_'))
        {
            const newPropertyKey = propertyKey.slice(1);
            if(Object.prototype.hasOwnProperty.call(target, newPropertyKey))
            {
                propertyKey = newPropertyKey;
            }
        }

        // get type and format to store in ifd
        const typeAndFormat = getTypeAndFormat(options.type, false);

        if (!globalThis.intuiface_ifd_properties[targetName]) {
            globalThis.intuiface_ifd_properties[targetName] = {};
        }

        // store values
        globalThis.intuiface_ifd_properties[targetName][propertyKey] = {
            type: typeAndFormat?.type,
            title: options.displayName,
            description: options.description,
            default: options.defaultValue,
            readonly: options.readOnly
        };

        // special case for type referencing another class 
        if (typeAndFormat === null && options.type && !options.itemType)
        {
            globalThis.intuiface_ifd_properties[targetName][propertyKey].extends =
                { $ref: options.type.name};
        }

        // special case for array
        if (typeAndFormat?.type === 'array' && options.itemType)
        {
            // store the item type
            let itemType: any = getTypeAndFormat(options.itemType, false);
            if (itemType == null)
            {
                itemType = {
                    $ref: options.itemType.name
                };
            }
            else if (itemType.format === null)
            {
                delete itemType.format;
            }
            globalThis.intuiface_ifd_properties[targetName][propertyKey].items = itemType;
            // force array to be readOnly and delete default value
            globalThis.intuiface_ifd_properties[targetName][propertyKey].readonly = true;
            delete globalThis.intuiface_ifd_properties[targetName][propertyKey].default;
        }

        // add format if it's defined
        if (typeAndFormat?.format) {
            globalThis.intuiface_ifd_properties[targetName][propertyKey].format = typeAndFormat.format;
        }

        // if there is no type, the default type is string
        if (typeAndFormat === null && !options.type)
        {
            globalThis.intuiface_ifd_properties[targetName][propertyKey].type = 'string';
        }
    };
}
