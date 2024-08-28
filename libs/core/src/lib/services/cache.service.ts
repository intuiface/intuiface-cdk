
/**
 * An object containing metadata about an entry in cache.
 */
export interface CacheEntry {
    /**
     * Name of the cache containing this entry.
     */
    cacheName: string;
    /**
     * source URL from where the data was requested.
     */
    sourceUrl: string;

    /**
     * URI of cache entry stored on file system and that can be used as source of HTML elements (such as `<img>`). _Only available when access to file system is possible_ (not for XP as webpage).
     */
    cacheUri?: string;

    /**
     * Date of last time entry was updated.
     */
    lastUpdate: Date;
}

/**
 * `Enum` of available cache strategies.
 */
export const enum CacheStrategy {
    /**
     * Only fetch response from network. _Response will not be cached_.  
     * Use this when you always want the most up-to-date response and disable cache.
     */
    NetworkOnly = 'NetworkOnly',

    /**
     * Only fetch response from cache. _No network request will be sent_.  
     * Use this when you know data is already cached and you absolutely don't want to update it.
     */
    CacheOnly = 'CacheOnly',

    /**
     * Make a network request first and fallback with response from cache if it fails.  
     * Use this when you want up-to-date response but accept cached data as fallback.
     */
    NetworkFirst = 'NetworkFirst',

    /**
     * Get response from cache first. If nothing is found, make a network request and cache response.  
     * Use for performance and you want to avoid making unnecessary network request.
     */
    CacheFirst = 'CacheFirst'
}

/**
 * `Enum` that defines if a cache is available across all experiences or only the current one.
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
 * An object configuring cache options for a request.
 */
export interface CacheOptions {
    /**
     * Strategy to use when requesting a resource.
     */
    strategy: CacheStrategy;

    /**
     * Name of the cache.  
     * It's a way to segregate data and easily retrieve cache entries. It can be considered as a folder and can include `/` separator to create sub-caches.  
     * If `null` of empty, defaults to global cache for interface assets.
     */
    cacheName: string;

    /**
     * Indicates if cache is shared between experiences or only available for the current running experience. Defaults to `Experience`.  
     * `Player` means cache is shared between experiences  
     * `Experience` means it will be available only for current experience and deleted if experience is removed from devices
     */
    cacheScope?: CacheScope;

    /**
     * Ignore query parameters. Defaults to `false`.
     */
    ignoreSearch?: boolean;

    /**
     * Enable caching an error response. Defaults to `false`.  
     * This can be useful for example when resource access requires authentication and you want to clear the cached data if authentication has been denied.
     */
    cacheErrorResponse?: boolean;

    /**
     * Enable caching for [XP as a Web page](https://support.intuiface.com/hc/en-us/articles/4407120931218-Details-about-Player-Next-Gen-on-the-Web).  
     * By default cache is disabled in _XP as a Web page_ and the browser do it according to Cache-Control header in response.  
     * If `true`, response will be cache through [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache) and browser will not clean it.
     * _So be careful not to use all user storage_.
     */
    enabledForXPWeb?: boolean;

    /**
     * Enable caching in Composer's Play mode. Defaults to `false`.
     */
    enabledForComposer?: boolean;
}

/**
 * Object containing information about a download progress.
 */
export interface DownloadProgress {
    /**
     * Number of bytes received for this download
     */
    receivedLength: number;
    /**
     * Number of total bytes to download from the `Response` content.
     */
    contentLength: number;
}
export type DownloadProgressCallback = (progress: DownloadProgress) => void;


/**
 * `CacheService` enhances the [`Fetch API`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) with caching strategy, allowing you to store locally request's responses and files and access them even offline.
 *
 * Cached data is stored through [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache) when using {@link fetch | `fetch()`} and on file system (only for Player in-venue, not XP as a Webpage) when using {@link downloadFile | `downloadFile()`}.
 *
 * Cache is persistent, which means it is kept between player launches. It can also be scoped to be associated to one experience or available across all. See {@link CacheScope} for details.
 *
 * @group Services
 */
export class CacheService {

    private constructor() {

    }

    /**
     * Enhanced global [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/fetch) with caching mechanism. Use fetch when you want to directly use the response content. To get path to a locally cached file, use {@link CacheService.downloadFile} instead.
     * @param request This defines the resource that you wish to fetch. See [`fetch()` parameters](https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters).
     * @param init An object containing any custom settings that you want to apply to the request, such as `headers`, `method`. See [`fetch()` parameters](https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters).
     * @param cacheOptions An object containing cache behaviors for the request.
     * @param progressCallback Use this callback to trace download progress.
     * @returns A `Promise` resolved when fetch succeed with the `Response` value.
     *
     * @example Fetch a json file with {@link CacheStrategy.NetworkFirst | _network first_} strategy:
     * ```ts
     * try
     * {
     *     const response = await CacheService.fetch(
     *                              'https://mydomain.com/data.json',
     *                              null,
     *                              {
     *                                  strategy: CacheStrategy.NetworkFirst,
     *                                  cacheName: 'myIA-data',
     *                                  cacheScope: CacheScope.Experience, // This data will not be shared across multiple XP
     *                                  cacheErrorResponse: false, // We don't want to have an error in cache.
     *                              });
     *      if(response.ok)
     *      {
     *          const json = await response.json();
     *          // Do something with json...
     *      }
     * }
     * catch(error)
     * {
     *     console.error('Failed to retrieve data:', error);
     * }
     * ```
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
     * @param request This defines the resource that you wish to fetch. See [`fetch()` parameters](https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters).
     * @param init An object containing any custom settings that you want to apply to the request, such as `headers`, `method`. See [`fetch()` parameters](https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters).
     * @param cacheOptions An object containing cache behaviors for the request.
     * @param progressCallback Use this callback to trace download progress.
     * @returns A Promise that resolve to an URI as `string` that can be used as source (i.e. `src` attribute) of a {@link HTMLElement} such as `<img>`.
     *
     * @example download an image with {@link CacheStrategy.CacheFirst | _cache first_} strategy and progress feedback:
     * ```ts
     * try
     * {
     *     const imageUri = await CacheService.downloadFile(
     *                              'https://mydomain.com/image.png',
     *                              null,
     *                              {
     *                                  strategy: CacheStrategy.CacheFirst,
     *                                  cacheName: 'myIA-data',
     *                                  cacheScope: CacheScope.Experience, // This image will not be shared across multiple XP
     *                                  cacheErrorResponse: false, // We don't want to have an error in cache.
     *                              }
     *                              (progress)=> {
     *                                  // compute percentage
     *                                  const percent = Math.round(progress.receivedLength / progress.contentLength * 100);
     *                                  console.log(`Downloaded ${percent}%`);
     *                              });
     *      if(response.ok)
     *      {
     *          // Do something with imageUri...
     *      }
     * }
     * catch(error)
     * {
     *     console.error('Failed to download image:', error);
     * }
     * ```
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
     * @param url URL of the resource to search
     * @param cacheName Name of the cache. If `null` of empty, defaults to global cache for interface assets.
     * @param cacheScope Scope of the cached resource. Defaults to {@link CacheScope.Experience}.
     *
     * @returns A Promise that resolve to an URI as `string` that can be used as source (i.e. `src` attribute) of a {@link HTMLElement} such as `<img>`.
     *
     */
    public static async getCacheURI(url: string, cacheName: string, cacheScope: CacheScope): Promise<string>
    {
        return new Promise(r => r(''));
    }

    /**
     * List entries cached in given cache
     * @param cacheName Name of the cache. If `null` of empty, defaults to global cache for interface assets.
     * @param cacheScope Scope of the cache entries to list. Defaults to {@link CacheScope.Experience}.
     * @returns A Promise that resolve to an array of {@link CacheEntry}.
     */
    public static async listCacheEntries(cacheName: string, cacheScope: CacheScope): Promise<CacheEntry[]>
    {
        return new Promise(r => r([]));

    }

    /**
     * Remove cached data for the given url
     * @param url URL of the resource to remove
     * @param cacheName Name of the cache. If `null` of empty, defaults to global cache for interface assets.
     * @param cacheScope Scope of the cached data to remove. Defaults to {@link CacheScope.Experience}.
     *
     * @returns A Promise that resolve when data has been removed from cache.
     *
     */
    public static async removeFromCache(url: string, cacheName: string, cacheScope: CacheScope): Promise<void>
    {
        return new Promise(r => r());
    }

    /**
     * Delete given cache
     * @param cacheName Name of the cache. If `null` of empty, defaults to global cache for interface assets.
     * @param cacheScope Scope of the cache to delete. Defaults to {@link CacheScope.Experience}.
     * @param failOnError If `true`, throws `Error` when deletion fails. Otherwise catch error silently. Defaults to `false`.
     *
     * @returns a Promise that resolve when cache has been deleted.
     *
     * @throws Error if fails and `failOnError` is `true`.
     */
    public static async deleteCache(cacheName: string,
                                    cacheScope: CacheScope,
                                    failOnError: boolean = true): Promise<void>
    {
        return new Promise(r => r());
    }
}
