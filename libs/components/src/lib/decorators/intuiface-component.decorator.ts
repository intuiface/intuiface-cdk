/* eslint-disable prefer-arrow/prefer-arrow-functions */
/**
 * Decorator to link Component (Angular Component) to a Model
 * This is usefell for dynamic component creation from a Model
 * @param args : arguments with model property
 */
export function IntuifaceComponent(args: any = {}): (cls: any) => any
{
    return (compType: any): void => {};
}
