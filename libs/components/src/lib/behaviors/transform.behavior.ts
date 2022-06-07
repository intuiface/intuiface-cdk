/**
 * Behavior to apply a transformation.
 */
export class TransformBehavior {
    //#region Properties

    /**
     * Position on X axis of the element.
     */
    public x = 0;

    /**
     * Position on Y axis of the element.
     */
    public y = 0;

    /**
     * Position on Z axis of the element.
     */
    public z = 0;

    /**
     * Orientation of the element.
     */
    public orientation = 0;

    /**
     * Width of the element.
     */
    public width = 300;

    /**
     * Height of the element.
     */
    public height = 200;

    //#endregion Properties

    //#region Actions

    /**
     * Action to translate the matrix.
     * @param x translation on X axis
     * @param y translation on Y axis
     * @param configuration configuration of the animation
     */
    public translateBy(x: number, y: number, configuration: unknown): void
    {
    }

    /**
     * Action to translate the matrix.
     * @param x translation on X axis
     * @param y translation on Y axis
     * @param configuration configuration of the animation
     */
    public translateTo(x: number, y: number, configuration: unknown): void
    {
    }

    /**
     * Action to rotate the matrix.
     * @param rotation rotation to add
     * @param configuration configuration of the animation
     */
    public rotateBy(orientation: number, configuration: unknown): void
    {
    }

    /**
     * Action to rotate the matrix.
     * @param orientation new orientation
     * @param configuration configuration of the animation
     */
    public rotateTo(orientation: number, configuration: unknown): void
    {
    }

    /**
     * Action to resize the element.
     * @param width width to add
     * @param height height to add
     * @param configuration configuration of the animation
     */
    public resizeBy(width: number, height: number, configuration: unknown): void
    {
    }

    /**
     * Action to resize the element.
     * @param width new width
     * @param height new height
     * @param configuration configuration of the animation
     */
    public resizeTo(width: number, height: number, configuration: unknown): void
    {
    }

    /**
     * Action to scale the element.
     * @param factor scale factor to apply
     * @param configuration configuration of the animation
     */
    public scaleBy( factor: number, configuration: unknown): void
    {
    }

    /**
     * Action to scale the element.
     * @param factor scale factor to apply
     * @param configuration configuration of the animation
     */
    public scaleTo(factor: number, configuration: unknown): void
    {
    }

    /**
     * Action to translate, rotate and resize the element.
     * @param x translation on X axis
     * @param y translation on Y axis
     * @param width new width
     * @param height new height
     * @param orientation new orientation
     * @param configuration configuration of the animation
     */
    public translateRotateResizeTo(x: number, y: number, width: number, height: number, orientation: number, configuration: unknown): void
    {
    }

    //#endregion Actions
}
