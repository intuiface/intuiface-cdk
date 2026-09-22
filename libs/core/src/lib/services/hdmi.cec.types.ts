/**
 * Current lifecycle state of the HDMI-CEC backend.
 *
 * @group Types
 */
export type HdmiCecStatus = 'uninitialized' | 'initializing' | 'ready' | 'unavailable';

/**
 * Result of one explicit native capability check.
 *
 * @group Types
 */
export type HdmiCecCheckStatus = 'not_checked' | 'passed' | 'failed';

/**
 * Stable errors exposed by the Player HDMI-CEC API.
 *
 * @group Types
 */
export type HdmiCecErrorCode =
    | 'UNSUPPORTED_PLATFORM' | 'UNSUPPORTED_DEVICE' | 'PLUGIN_UNAVAILABLE'
    | 'NOT_INITIALIZED' | 'INVALID_FRAME' | 'SU_NOT_FOUND'
    | 'ROOT_ACCESS_DENIED' | 'CEC_DRIVER_UNAVAILABLE' | 'CEC_ACCESS_DENIED'
    | 'QUEUE_FULL' | 'TIMEOUT' | 'EXECUTION_FAILED' | 'SEND_FAILED' | 'CANCELLED';

/**
 * Android device information captured for diagnostics only.
 *
 * Firmware/build information is reported for troubleshooting; it is not checked
 * against an allowlist of supported versions.
 *
 */
export interface HdmiCecDeviceIdentity {
    /** Device manufacturer reported by Android. */
    manufacturer?: string;
    /** Device model reported by Android. */
    model?: string;
    /** Device codename reported by Android. */
    device?: string;
    /** Product name reported by Android. */
    product?: string;
    /** Android SDK level. */
    sdk?: number;
    /** Firmware build identifier reported by Android. */
    build?: string;
    /** Player application identifier. */
    applicationId?: string;
}

/**
 * Last known HDMI-CEC state, returned without performing a new capability check.
 *
 * The initial hardware target is the CELabs CE440 using the CELabs mechanism.
 * This contract does not imply support for every rooted Android device. The CDK
 * itself provides neither root access nor shell access.
 *
 */
export interface HdmiCecDiagnostics {
    /** Native backend selected by the Player. */
    backend: 'celabs-sysfs';
    /** Current backend lifecycle state. */
    status: HdmiCecStatus;
    /** Android identity, when it could be collected. */
    identity?: HdmiCecDeviceIdentity;
    /** Result of the most recent root capability check. */
    rootCheck: HdmiCecCheckStatus;
    /** Result of the most recent CELabs sysfs capability check. */
    sysfsCheck: HdmiCecCheckStatus;
    /** Most recent structured native error, when one was recorded. */
    lastError?: HdmiCecErrorData;
    /** ISO timestamp of the last diagnostics update. */
    updatedAt: string;
}

/**
 * Structured HDMI-CEC error fields preserved across the native bridge.
 *
 * `failedFrameIndex` is zero-based and `submittedCount` counts writes completed
 * before the failure. When `outcome` is `unknown`, callers must not infer that no
 * frame was sent; automatic retries can therefore be unsafe, especially for
 * volume and mute operations.
 *
 */
export interface HdmiCecErrorData {
    /** Stable machine-readable error code. */
    code: HdmiCecErrorCode;
    /** Human-readable error description. */
    message: string;
    /** Backend stage at which the operation failed. */
    stage: string;
    /** Identifier assigned to the operation. */
    operationId: string;
    /** Native process exit code, when available. */
    exitCode?: number;
    /** Native standard error output, when available. */
    stderr?: string;
    /** Zero-based index of the sequence frame that failed. */
    failedFrameIndex?: number;
    /** Number of writes completed before the failure. */
    submittedCount?: number;
    /** Whether nothing was submitted or the submission outcome cannot be established. */
    outcome?: 'not_submitted' | 'unknown';
}

/**
 * Public HDMI-CEC operations available to Interface Assets.
 *
 * At runtime, a compatible Player supplies the native implementation.
 *
 */
export interface IHdmiCecService {
    /**
     * Explicitly checks that the native backend is available.
     *
     * This performs capability checks; it does not turn on the display.
     */
    initialize(): Promise<void>;

    /**
     * Sends one complete raw CEC frame after successful initialization.
     *
     * A successful result means the write completed without a detected error. It
     * does not mean that the display acknowledged the frame or performed an action.
     *
     * @param bytes Complete frame represented as byte values
     */
    send(bytes: number[]): Promise<void>;

    /**
     * Sends a sequence without interleaving other operations from this service.
     *
     * This does not provide exclusivity against other applications using the CEC
     * bus. A successful result only confirms writes without detected errors, not
     * acknowledgements or effects on the display.
     *
     * @param frames Complete raw CEC frames represented as byte arrays
     */
    sendSequence(frames: number[][]): Promise<void>;

    /**
     * Returns the last known diagnostics without performing a new capability check.
     *
     * On Android this can reject when the native plugin is unavailable.
     */
    getDiagnostics(): Promise<HdmiCecDiagnostics>;
}

/**
 * Error implementation used by the public HDMI-CEC service.
 *
 * At module boundaries, callers should inspect the structured `code`, `message`,
 * and `stage` fields defensively. `instanceof HdmiCecError` can be false when
 * multiple copies of the module provide different constructor identities.
 *
 * @group Classes
 */
export class HdmiCecError extends Error implements HdmiCecErrorData {
    /** Stable machine-readable error code. */
    public readonly code: HdmiCecErrorCode;
    /** Backend stage at which the operation failed. */
    public readonly stage: string;
    /** Identifier assigned to the operation. */
    public readonly operationId: string;
    /** Native process exit code, when available. */
    public readonly exitCode?: number;
    /** Native standard error output, when available. */
    public readonly stderr?: string;
    /** Zero-based index of the sequence frame that failed. */
    public readonly failedFrameIndex?: number;
    /** Number of writes completed before the failure. */
    public readonly submittedCount?: number;
    /** Whether nothing was submitted or the submission outcome cannot be established. */
    public readonly outcome?: 'not_submitted' | 'unknown';

    /**
     * Creates an HDMI-CEC error from its stable transport data.
     *
     * @param data Structured native or Player error data
     */
    public constructor(data: HdmiCecErrorData) {
        super(data.message);
        this.name = 'HdmiCecError';
        Object.assign(this, data);
        this.code = data.code;
        this.stage = data.stage;
        this.operationId = data.operationId;
    }
}
