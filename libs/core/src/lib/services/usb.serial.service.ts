/**
 * Usb serial service to access to usb port, open it and write to it
 *
 * @group Services
 */
export class UsbSerialService {

    /**
     * Get the instance of the usb serial service.
     * @returns an instance of the usb serial service
     * @deprecated Use the new {@link createInstance} instead.
     */
    public static getInstance(): UsbSerialService {
        return UsbSerialService.createInstance();
    }

    /**
     * Create an instance of the usb serial service.
     * @returns an instance of the usb serial service
     */
    public static createInstance(): UsbSerialService {
        return null;
    }

    /**
     * List all devices
     *
     * @returns {string | null} error
     * @returns {[string] ?} list of ports (USB0, USB1, ...)
     */
    public list(): Promise<string[]>{
        return Promise.resolve([]);
    }


    /**
     * Open the serial port
     * @param opts :
     * { port: string, pid: number, vid: number,
     * baudRate: number, dataBits: number, stopBits: number, parity: number,
     * dtr: boolean, rts: boolean, sleepOnPause: boolean}
     *
     * @returns {string | null} error
     * @returns {string} result: a message telling if the port is opened or not
     */
    public open(opts: any): Promise<string> {
        return Promise.resolve('');
    }

    /**
     * Write to the serial port
     * @param {string} data
     */
    public write(data: string): Promise<void> {
        return Promise.resolve();
    }

    /**
     * Close the serial port
     */
    public close(): Promise<void> {
        return Promise.resolve();
    }

    /**
     * Register a callback to be called when data is received
     * @param {function} callbackToRegister
     * @param {registerReadCallback~callback} callback
     * @param {string} data
     *
     * @returns {void}
     */
    public registerReadCallback(callbackToRegister: Function): Promise<void> {
        return Promise.resolve();
    }

    /**
     * Check if is connected
     *
     * @returns {boolean} isConnected
     */
    public isConnected(): Promise<boolean> {
        return Promise.resolve(false);
    }

    /**
     * Dispose
     */
    public dispose(): void {}
}
