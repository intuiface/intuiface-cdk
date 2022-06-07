/**
 * Service to get system information (device id, device name ...etc)
 */
export class SystemInfoService
{
     //#region Device info

    /**
    * Get the unique ID of the device
    * @returns Device ID
    */
    public async getDeviceId(): Promise<string> {
        return '';
    }

    /**
     * Get the device name
     * @returns the device name
     */
    public async getDeviceName(): Promise<string> {
        return '';
    }

    /**
     * Get the platform (ios, android or web)
     * @returns platform
     */
    public getPlatform(): string {
        return '';
    }

    /**
     * Get OS
     * @returns Operating system and os version in same string
     */
    public async getOS(): Promise<string> {
        return '';
    }

    //#endregion Device info

    //#region Application info

    /**
     * Get the application name
     * @return application name
     */
    public getApplicationName(): string {
        return '';
    }

    //#endregion Application info
}
