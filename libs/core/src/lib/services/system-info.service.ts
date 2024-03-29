/**
 * Service to get system information (device id, device name ...etc)
 *
 * @group Services
 */
export class SystemInfoService
{
    //#region Device info

    /**
     * Get the unique ID of the device
     * @returns Device ID
     */
    public async getDeviceId(): Promise<string> {
        return await new Promise(r => { r(''); });
    }

    /**
     * Get the device name
     * @returns the device name
     */
    public async getDeviceName(): Promise<string> {
        return await new Promise(r => { r(''); });
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
        return await new Promise(r => { r(''); });
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
