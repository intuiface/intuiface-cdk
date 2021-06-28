import { IConvertibleType } from './convertible.type';

/**
 * Time type
 */
export class Time implements IConvertibleType {

    /**
     * Constructor
     * @param hours
     * @param minutes
     * @param seconds
     */
    public constructor(public hours: number, public minutes: number, public seconds: number)
    {

    }

    /**
     * Convert time to string
     */
    public toString(): string
    {
        return `${this.hours.toString().padStart(2, '0')}:${this.minutes.toString().padStart(2, '0')}:${this.seconds.toString().padStart(2, '0')}`;
    }

    /**
     * Check if the type can be converted
     * @param type
     */
    public canConvertTo(type: unknown): boolean
    {
        return type === String || type === Time;
    }

    /**
     * Function to convert a Time to another type
     * @param type
     */
    public convertTo(type: unknown): unknown
    {
        switch (type)
        {
            case String:
                return `${this.hours.toString().padStart(2, '0')}:${this.minutes.toString().padStart(2, '0')}:${this.seconds.toString().padStart(2, '0')}`;
        }
        return this;
    }

    /**
     * Convert a value to a Time
     * @param value
     */
    public static convertFrom(value: unknown): Time
    {
        let time;
        if (typeof (value) == 'string')
        {
            time = value.split(':');
            return new Time(parseInt(time[0]), parseInt(time[1]), parseInt(time[2]));
        }
        else
        {
            time = value;
            const hours = Math.floor(time / 3600);
            time = time - hours * 3600;
            const minutes = Math.floor(time / 60);
            const seconds = time - minutes * 60;
            return new Time(hours, minutes, seconds);
        }
    }

    /**
     * Check if we can convert value to Time
     * @param value
     */
    public static canConvertFrom(value: unknown): boolean
    {
        return value != null && (typeof (value) == 'string' || typeof(value) == 'number');
    }
}
