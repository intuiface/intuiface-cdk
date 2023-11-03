
/**
 * Service to expose information about the environment context in which Player is running
 *
 * @group Services
 */
export class EnvironmentService {

    /**
     * Indicates if browser is ready to prompt install app
     */
    public static get canPromptInstallApp(): boolean {
        return false;
    }

    /**
     * Susbscribes to be notified of canPromptInstallApp changes
     * @param listener listener function
     */
    public static subscribeToCanPromptInstallChanges(listener: Function): void
    {
        // Empty implementations
    }

    /**
     * Unsusbscribes to be notified of canPromptInstallApp changes
     * @param listener listener function
     */
    public static unsubscribeToCanPromptInstallChanges(listener: Function): void
    {
        // Empty implementations
    }

    /**
     * Prompt App installation
     */
    public static promptInstallApp(): void {
        // Empty implementations
    }
}
