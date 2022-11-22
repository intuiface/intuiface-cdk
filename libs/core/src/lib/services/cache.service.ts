
/**
 * Metadata about stored data in cache
 */
export interface CacheEntry {
    /**
     * Name of the cache
     */
    cacheName: string;
    /**
     * source URL from where the data was requested
     */
    sourceUrl: string;

    /**
     * URI of cache entry stored on file system and that can be used as source of HTML elements (such as <img>).
     */
    cacheUri?: string;

    /**
     * Date from last time entry was updated
     */
    lastUpdate: Date;
}

/**
 * Cache strategies.
 */
export const enum CacheStrategy {
    /**
     * Only fetch response from network. Response will not be cached.
     * Use this when you always want the most up-to-date response and disable cache.
     */
    NetworkOnly = 'NetworkOnly',

    /**
     * Only fetch response from cache. No network request will be sent.
     * Use this when you know data is already cached and you absolutly don't want to update it.
     */
    CacheOnly = 'CacheOnly',

    /**
     * Make a network request first and fallback with response from cache if it fails.
     * Use this when you want up-to-date response but accept cached data as fallback.
     * Cache will be updated with response from network.
     */
    NetworkFirst = 'NetworkFirst',

    /**
     * Get response from cache first. If nothing is found, make a network request and cache response.
     * Use performance and you want to avoid making unecessary network request.
     */
    CacheFirst = 'CacheFirst'
}

/**
 * Cache scope defines if a cache is available across all experiences or only the current one.
 */
export const enum CacheScope {
    /**
     * Player scope means cache will be shared between all experiences.
     */
    Player = 'player',

    /**
     * Experience scope means cache will be available only for current experience.
     * @remarks When deleting experience, Player will delete all cache associated with this experience.
     */
    Experience = 'experience'
}

/**
 * Cache options
 */
export interface CacheOptions {
    /**
     * Strategy to use when requesting a resource
     */
    strategy: CacheStrategy;

    /**
     * Name of the cache
     */
    cacheName: string;

    /**
     * Indicates if cache is shared between experiences or only available for the current running experience.
     * `player` means cache is shared between experiences
     * `experience` means it will be available only for current experience and deleted if experience is removed from devices
     */
    cacheScope?: CacheScope;

    /**
     * Ignore query parameters. Defaults to false.
     */
    ignoreSearch?: boolean;

    /**
     * Enable caching an error response. Defaults to false.
     */
    cacheErrorResponse?: boolean;

    /**
     * Enable caching for XP as a Web page.
     * By default cache is disabled and the browser do it according to Cache-Control header in response.
     * If true, response will be cache through Cache API and browser will not clean it.
     * So be careful not to use all user storage.
     */
    enabledForXPWeb?: boolean;

    /**
     * Enable caching in Composer's Play mode. Defaults to false.
     */
    enabledForComposer?: boolean;
}


export interface DownloadProgress {
    receivedLength: number;
    contentLength: number;
}
export type DownloadProgressCallback = (progress: DownloadProgress) => void;


/**
 * Service to make request or download file with a caching strategy
 */
export class CacheService {

    /**
     * Enhanced global fetch() with caching mechanism.
     * Use fetch when you want to directly use the response content.
     * To get path to a locally cached file, use downloadFile() instead.
     * @param request
     * @param init
     * @param cacheOptions
     * @param progressCallback
     * @returns
     */
    public static async fetch(request: RequestInfo,
                              init?: RequestInit,
                              cacheOptions?: CacheOptions,
                              progressCallback?: DownloadProgressCallback): Promise<Response>
    {
        return new Promise(r => r(new Response('')));
    }

    /**
     * Downloads a file into local cache and returns its local uri
     * @param request
     * @param init
     * @param cacheOptions
     * @param progressCallback
     * @returns
     */
    public static async downloadFile(request: RequestInfo,
                                     init?: RequestInit,
                                     cacheOptions?: CacheOptions,
                                     progressCallback?: DownloadProgressCallback): Promise<string>
    {
        return new Promise(r => r(''));

    }

    /**
     * Get cache URI for the given url
     * @param url
     * @param cacheName
     * @param cacheScope
     */
    public static async getCacheURI(url: string, cacheName: string, cacheScope: CacheScope): Promise<string>
    {
        return new Promise(r => r(''));
    }

    /**
     * List entries cached in given cache
     * @param cacheName
     * @param cacheScope
     * @returns
     */
    public static async listCacheEntries(cacheName: string, cacheScope: CacheScope): Promise<CacheEntry[]>
    {
        return new Promise(r => r([]));

    }

    /**
     * Remove cached data for the given url
     * @param url
     * @param cacheName
     * @param cacheScope
     */
    public static async removeFromCache(url: string, cacheName: string, cacheScope: CacheScope): Promise<void>
    {
        return new Promise(r => r());
    }

    /**
     * Delete given cache
     * @param cacheName
     * @param cacheScope
     * @param failOnError if true, throw PlayerError when delete fails.
     */
    public static async deleteCache(cacheName: string,
                                    cacheScope: CacheScope,
                                    failOnError: boolean = true): Promise<void>
    {
        return new Promise(r => r());
    }
}
