import { Resource } from '@intuiface/core';
import { ExportedList, SharingBehavior } from '../behaviors/sharing.behavior';

/**
 * Service to manage font.
 */
export class SharingService
{
    /**
     * Register a Sharing Queue
     */
    public static registerSharingQueue(sharingQueue: SharingBehavior): void
    {
    }

    /**
     * Unregister sharing queue
     * @param sharingQueue
     */
    public static unregisterSharingQueue(sharingQueue: SharingBehavior): void
    {
    }

    /**
     * Add item to sharing queues
     * @param item
     * @param sharingQueue
     * @returns boolean to precise if the item is added
     */
    public static async addItemToSharingQueue(item: Resource, sharingQueue: ExportedList | string): Promise<boolean>
    {
        return true;
    }

    /**
     * Remove item from sharing queues
     * @param item
     */
    public static removeItemFromSharingQueue(item: Resource, sharingQueue: ExportedList | string): void
    {
    }
}
