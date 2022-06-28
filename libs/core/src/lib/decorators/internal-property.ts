/* eslint-disable prefer-arrow/prefer-arrow-functions */
/**
 * Property decorator to notify changes.
 */
export function InternalProperty()
{
    return (target: unknown, propertyKey: string): void =>
    {
        // test comment
        // test comment 2 for release
    };
}
