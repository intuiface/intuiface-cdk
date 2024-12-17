/**
 * Service to get system information (device id, device name ...etc)
 *
 * @group Services
 */
export class SystemInfoService
{
    /**
     * Get the instance of the system info service.
     * You have to call this method to be able to call other methods to get system information.
     * ```ts
     * await SystemInfoService.getInstance().getPlatform()
     * ```
     * @returns an instance of the system info service
     */
    public static getInstance(): SystemInfoService
    {
        return null;
    }

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
    public async getPlatform(): Promise<string> {
        return await new Promise(r => { r(''); });
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
