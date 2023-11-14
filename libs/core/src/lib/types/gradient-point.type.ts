import { SolidColor } from './solid-color.type';

/**
 * Gradient point type
 */
export class GradientPoint
{
    /**
     * Constructor
     */
    public constructor(public offset: number, public color: SolidColor)
    {
    }

    /**
     * Create a string with an array of gradient points for the css
     */
    public static getGradientPointsForCss(gradientPoints: GradientPoint[]): string
    {
        let gradientPointsString = '';
        gradientPoints.forEach(gradientPoint =>
        {
            gradientPointsString += gradientPoint.color.toString();
            gradientPointsString += ` ${(gradientPoint.offset * 100).toString()}%`;
            gradientPointsString += ', ';
        });
        gradientPointsString = gradientPointsString.slice(0, -2);

        return gradientPointsString;
    }
}
