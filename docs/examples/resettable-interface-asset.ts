import { Action, Asset, IntuifaceElement, Property, ResetValue } from '@intuiface/core';

/**
 * A counter that increases after a short delay.
 * Resetting it returns the count to zero and stops any increase that is still waiting to happen.
 * Requires Player 8.3.1 or later because it uses @ResetValue.
 */
@Asset({ name: 'ResettableCounter', category: 'Examples', behaviors: [] })
export class ResettableCounter extends IntuifaceElement
{
    // How long to wait before increasing the count. 1000 milliseconds is one second.
    // This property can be changed in Composer.
    @Property({ displayName: 'Delay (ms)', type: Number, defaultValue: 1000 })
    public delay = 1000;

    // readOnly makes this a result that Composer can use but cannot edit.
    // enabled: true tells Player to reset it to its starting value (zero here).
    @Property({ displayName: 'Count', type: Number, readOnly: true, defaultValue: 0, resetOptions: { enabled: true } })
    public count = 0;

    // Imagine these labels were loaded from a file or a web service.
    // We want to keep them available after a reset, without loading them again.
    // A read-only property keeps its current value by default.
    @Property({ displayName: 'Labels', type: Array, itemType: String, readOnly: true })
    public labels: string[] = [];

    // Our code changes this message while waiting for the count to increase.
    // We set it back to 'Ready' ourselves in afterResetFromConfiguration() below.
    @Property({ displayName: 'Status', type: String, readOnly: true })
    public status = 'Ready';

    // setTimeout gives us a reference to the timer so we can stop it later.
    // Keep that reference until our code clears it. This option does not stop the timer;
    // cancelPending() below does that.
    @ResetValue({ enabled: false })
    private _pending: ReturnType<typeof setTimeout> | null = null;

    @Action({ displayName: 'Increment later' })
    public incrementLater(): void
    {
        // Stop any previous timer so only one increase can be waiting at a time.
        this.cancelPending();
        this.status = 'Waiting';
        this._pending = setTimeout(() =>
        {
            // The waiting time is over: there is no longer a timer to cancel.
            this._pending = null;
            this.count++;
            this.status = 'Ready';
        }, this.delay);
    }

    @Action({ displayName: 'Reset counter' })
    public reset(): void
    {
        // Ask Player to run the same reset steps used when Composer requests a reset.
        // Naming an action 'reset' alone does not make it run those steps.
        this.resetFromConfiguration();
    }

    protected override beforeResetFromConfiguration(): void
    {
        // Keep this super call so the base class can do its reset work too.
        super.beforeResetFromConfiguration();
        // Prevent an old timer from increasing the count after it has been reset to zero.
        this.cancelPending();
    }

    protected override afterResetFromConfiguration(): void
    {
        super.afterResetFromConfiguration();
        // Player has reset the count. Update the message our code manages as well.
        this.status = 'Ready';
    }

    public override dispose(): void
    {
        // Also stop the timer when this asset is removed or the experience closes.
        this.cancelPending();
        super.dispose();
    }

    private cancelPending(): void
    {
        if (this._pending !== null)
        {
            clearTimeout(this._pending);
            // Remember that no increase is waiting anymore.
            this._pending = null;
        }
    }
}
