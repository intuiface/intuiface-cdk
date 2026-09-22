import { IHdmiCecService } from './hdmi.cec.types';

/**
 * Public entry point for the Player-provided HDMI-CEC service.
 *
 * The initial native implementation targets the CELabs CE440 through the CELabs
 * mechanism; it is not a universal rooted-Android API. The CDK does not perform
 * native, root, or shell operations.
 *
 * @group Services
 */
export class HdmiCecService {
    /** Shared platform service instance. Prefer {@link getInstance} for normal access. */
    public static instance: IHdmiCecService;

    /**
     * Returns the shared service supplied by the Player runtime.
     *
     * @returns Shared HDMI-CEC service instance
     */
    public static getInstance(): IHdmiCecService {
        return HdmiCecService.instance;
    }
}
