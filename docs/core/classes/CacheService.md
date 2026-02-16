[**@intuiface/core**](../README.md)

***

# Class: CacheService

`CacheService` enhances the [`Fetch API`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) with caching strategy, allowing you to store locally request's responses and files and access them even offline.

Cached data is stored through [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache) when using [\`fetch()\`](https://developer.mozilla.org/docs/Web/API/Window/fetch) and on file system (only for Player in-venue, not XP as a Webpage) when using [\`downloadFile()\`](#downloadfile).

Cache is persistent, which means it is kept between player launches. It can also be scoped to be associated to one experience or available across all. See [CacheScope](../enumerations/CacheScope.md) for details.

## Methods

### fetch()

> `static` **fetch**(`request`, `init?`, `cacheOptions?`, `progressCallback?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Response`](https://developer.mozilla.org/docs/Web/API/Response)\>

Enhanced global [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/fetch) with caching mechanism. Use fetch when you want to directly use the response content. To get path to a locally cached file, use [CacheService.downloadFile](#downloadfile) instead.

#### Parameters

##### request

`RequestInfo`

This defines the resource that you wish to fetch. See [`fetch()` parameters](https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters).

##### init?

`RequestInit`

An object containing any custom settings that you want to apply to the request, such as `headers`, `method`. See [`fetch()` parameters](https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters).

##### cacheOptions?

[`CacheOptions`](../interfaces/CacheOptions.md)

An object containing cache behaviors for the request.

##### progressCallback?

`DownloadProgressCallback`

Use this callback to trace download progress.

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`Response`](https://developer.mozilla.org/docs/Web/API/Response)\>

A `Promise` resolved when fetch succeed with the `Response` value.

#### Example

```ts
try
{
    const response = await CacheService.fetch(
                             'https://mydomain.com/data.json',
                             {
                                 headers: {
                                    'Accept': 'application/json',
                                    'Authorization': 'Bearer API_TOKEN'
                                 }
                             },
                             {
                                 strategy: CacheStrategy.NetworkFirst, // Data will first be fetch from network and fallback on cache
                                 cacheName: 'myIA-data',
                                 cacheScope: CacheScope.Experience, // This data will not be shared across multiple XP
                                 cacheErrorResponse: true, // In this example, if response is an error, it will be cached to avoid keeping authenticated data in cache
                             });
     if(response.ok)
     {
         const json = await response.json();
         // Do something with json...
     }
}
catch(error)
{
    console.error('Failed to retrieve data:', error);
}
```

***

### downloadFile()

> `static` **downloadFile**(`request`, `init?`, `cacheOptions?`, `progressCallback?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

Downloads a file into local cache and returns its local uri

#### Parameters

##### request

`RequestInfo`

This defines the resource that you wish to fetch. See [`fetch()` parameters](https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters).

##### init?

`RequestInit`

An object containing any custom settings that you want to apply to the request, such as `headers`, `method`. See [`fetch()` parameters](https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters).

##### cacheOptions?

[`CacheOptions`](../interfaces/CacheOptions.md)

An object containing cache behaviors for the request.

##### progressCallback?

`DownloadProgressCallback`

Use this callback to trace download progress.

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

A Promise that resolve to an URI as `string` that can be used as source (i.e. `src` attribute) of a [HTMLElement](https://developer.mozilla.org/docs/Web/API/HTMLElement) such as `<img>`.

#### Example

```ts
try
{
    const imageUri = await CacheService.downloadFile(
                             'https://mydomain.com/image.png',
                             null,
                             {
                                 strategy: CacheStrategy.CacheFirst,
                                 cacheName: 'myIA-data',
                                 cacheScope: CacheScope.Experience, // This image will not be shared across multiple XP
                                 cacheErrorResponse: false, // We don't want to have an error in cache.
                             }
                             (progress)=> {
                                 // compute percentage
                                 const percent = Math.round(progress.receivedLength / progress.contentLength * 100);
                                 console.log(`Downloaded ${percent}%`);
                             });
     if(response.ok)
     {
         // Do something with imageUri...
     }
}
catch(error)
{
    console.error('Failed to download image:', error);
}
```

***

### getCacheURI()

> `static` **getCacheURI**(`url`, `cacheName`, `cacheScope`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

Get cache URI for the given url

#### Parameters

##### url

`string`

URL of the resource to search

##### cacheName

`string`

Name of the cache. If `null` or empty, defaults to global cache for interface assets.

##### cacheScope

[`CacheScope`](../enumerations/CacheScope.md)

Scope of the cached resource. Defaults to [CacheScope.Experience](../enumerations/CacheScope.md#experience).

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`string`\>

A Promise that resolve to an URI as `string` that can be used as source (i.e. `src` attribute) of a [HTMLElement](https://developer.mozilla.org/docs/Web/API/HTMLElement) such as `<img>`.

***

### listCacheEntries()

> `static` **listCacheEntries**(`cacheName`, `cacheScope`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`CacheEntry`](../interfaces/CacheEntry.md)[]\>

List entries cached in given cache

#### Parameters

##### cacheName

`string`

Name of the cache. If `null` or empty, defaults to global cache for interface assets.

##### cacheScope

[`CacheScope`](../enumerations/CacheScope.md)

Scope of the cache entries to list. Defaults to [CacheScope.Experience](../enumerations/CacheScope.md#experience).

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<[`CacheEntry`](../interfaces/CacheEntry.md)[]\>

A Promise that resolve to an array of [CacheEntry](../interfaces/CacheEntry.md).

***

### removeFromCache()

> `static` **removeFromCache**(`url`, `cacheName`, `cacheScope`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Remove cached data for the given url

#### Parameters

##### url

`string`

URL of the resource to remove

##### cacheName

`string`

Name of the cache. If `null` or empty, defaults to global cache for interface assets.

##### cacheScope

[`CacheScope`](../enumerations/CacheScope.md)

Scope of the cached data to remove. Defaults to [CacheScope.Experience](../enumerations/CacheScope.md#experience).

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

A Promise that resolve when data has been removed from cache.

***

### deleteCache()

> `static` **deleteCache**(`cacheName`, `cacheScope`, `failOnError?`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

Delete given cache

#### Parameters

##### cacheName

`string`

Name of the cache. If `null` or empty, defaults to global cache for interface assets.

##### cacheScope

[`CacheScope`](../enumerations/CacheScope.md)

Scope of the cache to delete. Defaults to [CacheScope.Experience](../enumerations/CacheScope.md#experience).

##### failOnError?

`boolean` = `true`

If `true`, throws `Error` when deletion fails. Otherwise catch error silently. Defaults to `true`.

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`void`\>

a Promise that resolve when cache has been deleted.

#### Throws

Error if fails and `failOnError` is `true`.


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/