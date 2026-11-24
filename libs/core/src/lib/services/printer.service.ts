/**
 * Base options for print operations.
 *
 */
export interface PrintCDKOptions {
    /**
     * Name displayed for the print job.
     */
    name?: string;

    /**
     * Raw base64 encoded content or a URI to the content to print.
     */
    dataOrUri: string;

    /**
     * MIME type of the content to print.
     */
    mimeType?: string;
}

/**
 * Native printer service.
 *
 * @group Services
 */
export class PrinterService {

    /**
     * Get an instance of the printer service.
     * @returns an instance of the printer service
     */
    public static getInstance(): PrinterService | null {
        return null;
    }

    /**
     * Print base64 encoded data or a file from device storage.
     * @param options The options for the print operation.
     */
    public async print(options: PrintCDKOptions): Promise<void> {
        return Promise.resolve();
    }
}
