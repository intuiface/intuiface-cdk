import { Color } from './color.type';
import { GradientPoint } from './gradient-point.type';
import { SolidColor } from './solid-color.type';

/**
 * Radial gradient type
 */
export class RadialGradient extends Color
{
    /**
     * Constructor
     */
    public constructor(public originPoint: string, public centerPoint: string,
                       public radiusX: number, public radiusY: number, public gradientPoints: GradientPoint[])
    {
        // Sort gradient points
        gradientPoints = gradientPoints.sort((a, b) => a.offset - b.offset);

        super();
    }

    /**
     * Function equals for the color type
     * @param color color to compare
     */
    public override equals(color: RadialGradient): boolean
    {
        if (!(color instanceof RadialGradient))
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
        return this.originPoint === color.originPoint
        && this.centerPoint === color.centerPoint
        && this.radiusX === color.radiusX
        && this.radiusY === color.radiusY;
    }

    /**
     * Convert a radial gradient to a string
     */
    public override toString(): string
    {
        const gradientPointsForCss = GradientPoint.getGradientPointsForCss(this.gradientPoints);
        const ellipseRadiusString = `ellipse ${this.radiusX * 100}% ${this.radiusY * 100}%`;
        return `radial-gradient(${ellipseRadiusString}, ${gradientPointsForCss})`;
    }

    /**
     * Is the color a gradient?
     */
    public override isGradient(): boolean
    {
        return true;
    }

    /**
     * Check if we can convert a value to a radial gradient
     * @param value
     */
    public static override canConvertFrom(value: unknown): boolean
    {
        return value && (value as any).centerPoint && (value as any).radiusX && (value as any).radiusY
        && (value as any).gradientPoints && (value as any).gradientPoints.length > 0;
    }

    /**
     * Convert a value to a radial gradient
     * @param value
     */
    public static override convertFrom(value: unknown): RadialGradient
    {
        if (value instanceof RadialGradient)
        {
            return value;
        }

        if (value && (value as any).originPoint && (value as any).centerPoint
            && (value as any).radiusX && (value as any).radiusY
            && (value as any).gradientPoints)
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

            return new RadialGradient(gradient.originPoint, gradient.centerPoint,
                parseFloat(gradient.radiusX), parseFloat(gradient.radiusY), gradientPoints);
        }
    }
}
