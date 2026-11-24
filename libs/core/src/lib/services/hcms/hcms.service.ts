import { HCMSBase } from './hcms.base';

/**
 * Service exposing a read-only view of HCMS bases loaded in Player.
 *
 * Use this service to retrieve a base by id and navigate its components and items.
 *
 * @example
 * Basic retrieval and navigation:
 * ```ts
 * const base = HCMSService.getBase('my-base-id');
 * const component = base.getComponent('my-component-id');
 * ```
 *
 * @group Services
 */
export class HCMSService
{
    private constructor()
    {
    }

    /**
     * Gets an HCMS base by id.
     *
     * @param baseId Identifier of the HCMS base.
     * @returns The matching {@link HCMSBase}.
     *
     * @throws Error if `baseId` is empty.
     * @throws Error if the base is not initialized in the running Player context.
    *
    * @example
    * ```ts
    * const base = HCMSService.getBase('my-base-id');
    * console.log(base.id, base.name);
    * ```
     */
    public static getBase(baseId: string): HCMSBase
    {
        if (!baseId || baseId.trim() === '')
        {
            throw new Error('HCMS baseId must be a non-empty string.');
        }

        return new HCMSBase();
    }

    /**
     * Manually refreshes memoized objects for one base.
     *
     * Call this after a base synchronization when you want to invalidate cached
     * components/items and force a rebuild on next access.
     *
     * @param baseId Identifier of the HCMS base.
     * @returns The refreshed {@link HCMSBase} instance.
     *
     * @example
     * ```ts
     * // Trigger your own sync process first with trigger/action within your experience, then refresh the base in the `HCMSService`.
     * const refreshedBase = HCMSService.refreshBase('123xyz456');
     * ```
     */
    public static refreshBase(baseId: string): HCMSBase
    {
        return this.getBase(baseId);
    }
}
