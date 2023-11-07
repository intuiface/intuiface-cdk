import { Color } from './color.type';
import { GradientPoint } from './gradient-point.type';
import { SolidColor } from './solid-color.type';

/**
 * Class to use to describe a linear gradient.
 *
 * @example ```ts
 * @Property({
 *     displayName: 'Background color',
 *     type: LinearGradient
 * })
 * public backgroundColor: LinearGradient;
 * ```
 * @group Types
 */
export class LinearGradient extends Color
{
    /**
     * Constructor
     */
    public constructor(public angle: number,
                       public startPoint: string, public endPoint: string, public gradientPoints: GradientPoint[])
    {
        // Convert the angle property for the CSS
        angle = Math.round(angle * 1);
        angle = (angle + 90) % 360;

        // Sort gradient points
        gradientPoints = gradientPoints.sort((a, b) => a.offset - b.offset);

        super();
    }

    /**
     * Function equals for the color type
     * @param color color to compare
     */
    public override equals(color: LinearGradient): boolean
    {
        if (!(color instanceof LinearGradient))
        {
            return false;
        }

        // Compare gradient points
        for (let i = 0; i < this.gradientPoints.length; i++)
        {
            if (!this.gradientPoints[i].color.equals(color.gradientPoints[i].color)
                || this.gradientPoints[i].offset !== color.gradientPoints[i].offset)
            {
                return false;
            }
        }

        // Compare other properties
        return this.angle === color.angle
        && this.startPoint === color.startPoint
        && this.endPoint === color.endPoint;
    }

    /**
     * Convert a linear gradient to a string
     */
    public override toString(): string
    {
        const gradientPointsForCss = GradientPoint.getGradientPointsForCss(this.gradientPoints);
        return `linear-gradient(${this.angle}deg, ${gradientPointsForCss})`;
    }

    /**
     * Is the color a gradient?
     */
    public override isGradient(): boolean
    {
        return true;
    }

    /**
     * Check if we can convert a value to a linear gradient
     * @param value
     */
    public static override canConvertFrom(value: unknown): boolean
    {
        return (value &&
            (value as any).angle && (value as any).gradientPoints && (value as any).gradientPoints.length > 0);
    }

    /**
     * Convert a value to a linear gradient
     * @param value
     */
    public static override convertFrom(value: unknown): LinearGradient
    {
        if (value instanceof LinearGradient)
        {
            return value;
        }

        if (value && (value as any).angle &&
                (value as any).startPoint && (value as any).endPoint && (value as any).gradientPoints)
        {
            const gradient = value as any;
            const gradientPoints: GradientPoint[] = [];
            gradient.gradientPoints.forEach((gradientPoint) =>
            {
                gradientPoints.push(
                    {
                        color: SolidColor.convertFrom(gradientPoint.color),
                        offset: gradientPoint.offset as number
                    }
                );
            });

            return new LinearGradient(gradient.angle, gradient.startPoint, gradient.endPoint, gradientPoints);
        }
    }
}
