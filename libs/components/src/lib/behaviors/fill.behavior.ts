/**
 * Fill behaviors
 */
export enum EFillBehavior
{
    Fit = 'Fit',
    Fill = 'Fill',
    Deform = 'Deform'
}

/**
 * Fill Behavior.
 */
export class FillBehavior {
    //#region Properties

    /**
     * Source of the resource.
     */
    public fillBehavior = EFillBehavior.Fit;

    //#endregion Properties

    /**
     * Return the object-fit value to set the Fill behavior of the asset
     */
    public getObjectFit(): string
    {
        switch (this.fillBehavior)
        {
            case EFillBehavior.Fit:
                return 'contain';
            case EFillBehavior.Fill:
                return 'cover';
            case EFillBehavior.Deform:
                return 'fill';
            default:
                return 'unset';
        }
    }
}
