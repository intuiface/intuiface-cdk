/* eslint-disable max-classes-per-file */
import { Watchable, Resource } from '@intuiface/core';

/**
 * Storage units
 */
export enum EStorageUnit
{
    Bytes = 'bytes',
    KiloBytes = 'kilobytes',
    MegaBytes = 'megabytes',
    GigaBytes = 'gigabytes'
}

/**
 * The item in sharing queue (with uri and file size properties)
 */
class ExportedItem extends Watchable
{
    //#region Properties

    /**
     * The Uri of the exported item
     */
    public uri: string = null;

    /**
     * The file size of the exported item
     */
    public fileSize: number = 0;


    //#endregion Properties

    /**
     * Constructor
     * @param uri
     * @param fileSize
     * @param contentType
     */
    public constructor(uri: string, fileSize: number, contentType: string)
    {
        super();
        this.uri = uri;
        this.fileSize = fileSize;
        this.contentType = contentType;
    }


    public contentType: string;

}

/**
 * Exported data source
 */
class ExportedDataSource
{
    //#region Public properties

    /**
     * The number of items in the list
     */
    public itemsCount: number = 0;

    /**
     * The items
     */
    public items: ExportedItem[] = [];

    //#endregion Public properties

}
interface ExportedDataSource { }


/**
 * An exported list of items
 */
export class ExportedList extends Watchable
{
    //#region Properties

    /**
     * List of exported images
     */
    public images: ExportedDataSource = new ExportedDataSource();

    /**
     * List of exported videos
     */
    public videos: ExportedDataSource = new ExportedDataSource();

    /**
     * List of exported documents
     */
    public documents: ExportedDataSource = new ExportedDataSource();

    /**
     * List of exported mesh models
     */
    public meshModels: ExportedDataSource = new ExportedDataSource();

    /**
     * List of exported Excel files
     */
    public excelFiles: ExportedDataSource = new ExportedDataSource();

    //#endregion
}

/**
 * Sharing behavior to manage asset sharing (add/remove element to sharing queue..etc)
 */
export class SharingBehavior
{

    //#region Properties

    /**
     * Items count.
     */
    public itemsCount: number = 0;

    /**
     * Total queue size
     */
    public totalQueueSize: number = 0;

    /**
     * Storage unit
     */
    public storageUnit: EStorageUnit = EStorageUnit.MegaBytes;

    /**
     * Sharing queue
     */
    public sharingQueue: ExportedList = new ExportedList();

    //#endregion Properties

    //#region Actions

    /**
     * Add item to sharing queue
     * @param data
     */
    public async addItemToSharingQueue(data: Resource): Promise<boolean>
    {
        return true;
    }

    /**
     * Remove item from sharing queue
     * @param data
     */
    public removeItemFromSharingQueue(data: Resource): void
    {
    }

    /**
     * Action to clear the sharing queue
     */
    public clearSharingQueue(): void
    {
    }

    //#endregion Actions

    //#region Triggers

    /**
     * trigger item added
     */
    public raiseItemIsAdded(): void { }

    /**
     * trigger item is removed
     */
    public raiseItemIsRemoved(): void { }

    /**
     * trigger is cleared
     */
    public raiseIsCleared(): void { }

    //#endregion Triggers
}


