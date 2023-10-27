/**
 * Usb serial service to access to usb port, open it and write to it
 *
 * @group Services
 */
export class UsbSerialService {

    protected static instance;

    /**
     * Get instance
     * @returns
     */
    public static getInstance() {
        return UsbSerialService.instance;
    }

    /**
     * List all devices
     * @param {list~callback} callback
     *
     *
     * @callback list~callback
     * @param {string | null} error
     * @param {[object] ?} result
     * @param {string} result.devicePort
     * @param {string} result.deviceId
     * @param {string} result.productId
     * @param {string} result.productName
     * @param {string} result.vendorId
     * @param {string} result.serialNumber
     * @param {string} result.manufacturerName
     * @param {string} result.interfaceCount
     */
    public list(callback: Function): void {
    }


    /**
     * Open the serial port
     * @param opts :
     * { port: string, pid: number, vid: number, driver: string,
     * baudRate: number, dataBits: number, stopBits: number, parity: number,
     * dtr: boolean, rts: boolean, sleepOnPause: boolean}
     * @param {open~callback} callback
     *
     * @callback open~callback
     * @param {string | null} error
     * @param {string ?} result
     */
    public open(opts: any, callback: Function): void {
    }

    /**
     * Write to the serial port
     * @param {string} data
     * @param {write~callback} callback
     *
     * @callback write~callback
     * @param {string | null} error
     * @param {string ?} result
     */
    public write(data: string, callback: Function): void {
    }

    /**
     * Close the serial port
     * @param {close~callback} callback
     *
     * @callback close~callback
     * @param {string | null} error
     */
    public close(callback: Function): void {
    }

    /**
     * Close the serial port
     * @param {function} callbackToRegister
     * @param {registerReadCallback~callback} callback
     *
     * @callback registerReadCallback~callback
     * @param {string} message
     */
    public registerReadCallback(callbackToRegister: Function, callback: Function): void {
    }

    /**
     * Check if is connected
     * @param {isConnected~callback} callback
     *
     * @callback isConnected~callback
     * @param {string | null} error
     * @param {boolean ?} result
     */
    public isConnected(callback: Function): void {
    }

    /**
     * Dispose
     */
    public dispose(): void {}
}
