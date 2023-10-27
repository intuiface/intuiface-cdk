import { IConvertibleType } from './convertible.type';

/**
 * Class to use to describe a time duration.
 *
 * @example ```ts
 * @Property({
 *     displayName: 'Remaining time',
 *     description: 'Remaing time before the end.',
 *     defaultValue: Time.Zero,
 *     type: Time
 * })
 * public remainingTime: Time;
 * ```
 *
 * @group Types
 */
export class Time implements IConvertibleType {

    //#region Static Constants

    /**
     * Instance of time representing an empty duration of zero.
     */
    public static readonly Zero = Time.convertFrom(0);

    /**
     * Instance of time representing a duration of 1 second.
     */
    public static readonly One = Time.convertFrom(1);

    //#endregion Static Constants

    //#region Fields

    /**
     * Time in string format
     */
    public readonly strTime: string;

    /**
     * Time in string format without milliseconds
     */
    public readonly strTimeWithoutMilliseconds: string;

    /**
     * Total time in seconds including ms
     */
    public readonly totalSeconds: number;

    /**
     * Total time in seconds without ms
     */
    public readonly totalIntegerSeconds: number;

    /**
     * Total time in ms
     */
    public readonly totalMilliseconds: number;

    //#endregion Fields

    //#region Life Cycle

    /**
     * Create a new time with given hours, minutes and seconds.
     * @param hours hours of the time
     * @param minutes minutes of the time
     * @param seconds seconds of the time
     */
    public constructor(public readonly hours: number,
                       public readonly minutes: number,
                       public readonly seconds: number)
    {
        this.totalSeconds = hours * 3600 + minutes * 60 + seconds;
        this.totalMilliseconds = this.totalSeconds * 1000;
        this.totalIntegerSeconds = Math.floor(hours * 3600 + minutes * 60 + seconds);

        const secondsAndMs = seconds.toString().split('.');
        let strSeconds = secondsAndMs[0].toString().padStart(2, '0');
        this.strTimeWithoutMilliseconds = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${strSeconds}`;
        if (secondsAndMs[1]) {
            // format to 00:00:00.000
            strSeconds = `${strSeconds}.${secondsAndMs[1].padEnd(3, '0')}`;
        }
        this.strTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${strSeconds}`;
    }

    //#endregion Life Cycle

    //#region Operations

    /**
     * Convert time to string
     * @param withoutMilliseconds show milliseconds in string result
     */
    public toString(withoutMilliseconds = false): string {
        return withoutMilliseconds ? this.strTimeWithoutMilliseconds : this.strTime;
    }

    /**
     * Check if the type can be converted
     * @param type
     */
    public canConvertTo(type: unknown): boolean {
        return type === String || type === Number || type === Time;
    }

    /**
     * Function to convert a Time to another type
     * @param type
     */
    public convertTo(type: unknown): unknown {
        switch (type) {

            case String:
            {
                return this.toString();
            }
            case Number:
                return this.totalSeconds;
        }
        return this;
    }

    /**
     * Convert a value to a Time
     * @param value Value can be converted from `string` or `number`. If `string`, it's parsed with the format `hh:mm:ss.ms`. If `number`, it's considered as a number of seconds.
     */
    public static convertFrom(value: unknown): Time {
        let time;
        if (typeof (value) == 'string') {
            time = value.split(':');
            return new Time(parseInt(time[0]), parseInt(time[1]), parseFloat(time[2]));
        }
        else {
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
    public static canConvertFrom(value: unknown): boolean {
        return value != null && (typeof (value) == 'string' || typeof (value) == 'number');
    }

    /**
     * Convert from seconds to time
     */
    public static fromSeconds(value: number): Time {
        return Time.convertFrom(value);
    }

    //#endregion Operations
}
