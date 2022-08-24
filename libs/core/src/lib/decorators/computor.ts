/* eslint-disable prefer-arrow/prefer-arrow-functions */
export interface IComputorOptions {
    /**
     * List of properties to watch that will trigger a call to the decorated method
     */
    inputs: string[];
}

/**
 * Decorator to automatically call the decorated method when one of the inputs changes
 * @param options
 */
export function Computor(options: IComputorOptions) {
    return (
        target: any,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ): void => {
    };
}
