# Class: CacheService

`CacheService` enhances the [`Fetch API`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) with caching strategy, allowing you to store locally request's responses and files and access them even offline.

Cached data is stored through [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache) when using [`fetch()`](CacheService.md#fetch) and on file system (only for Player in-venue, not XP as a Webpage) when using [`downloadFile()`](CacheService.md#downloadfile).

Cache is persistent, which means it is kept between player launches. It can also be scoped to be associated to one experience or available across all. See [CacheScope](../enums/CacheScope.md) for details.

## Table of contents

### Methods

- [fetch](CacheService.md#fetch)
- [downloadFile](CacheService.md#downloadfile)
- [getCacheURI](CacheService.md#getcacheuri)
- [listCacheEntries](CacheService.md#listcacheentries)
- [removeFromCache](CacheService.md#removefromcache)
- [deleteCache](CacheService.md#deletecache)

## Methods

### fetch

▸ `Static` **fetch**(`request`, `init?`, `cacheOptions?`, `progressCallback?`): [`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<[`Response`]( https://developer.mozilla.org/en-US/docs/Web/API/Response )\>

Enhanced global [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/fetch) with caching mechanism. Use fetch when you want to directly use the response content. To get path to a locally cached file, use [CacheService.downloadFile](CacheService.md#downloadfile) instead.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | `RequestInfo` | This defines the resource that you wish to fetch. See [`fetch()` parameters](https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters). |
| `init?` | `RequestInit` | An object containing any custom settings that you want to apply to the request, such as `headers`, `method`. See [`fetch()` parameters](https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters). |
| `cacheOptions?` | [`CacheOptions`](../interfaces/CacheOptions.md) | An object containing cache behaviors for the request. |
| `progressCallback?` | `DownloadProgressCallback` | Use this callback to trace download progress. |

#### Returns

[`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<[`Response`]( https://developer.mozilla.org/en-US/docs/Web/API/Response )\>

A `Promise` resolved when fetch succeed with the `Response` value.

**`Example`**

Fetch a json file with [_network first_](../enums/CacheStrategy.md#networkfirst) strategy:
```ts
try
{
    const response = await CacheService.fetch(
                             'https://mydomain.com/data.json',
                             null,
                             {
                                 strategy: CacheStrategy.NetworkFirst,
                                 cacheName: 'myIA-data',
                                 cacheScope: CacheScope.Experience, // This data will not be shared across multiple XP
                                 cacheErrorResponse: false, // We don't want to have an error in cache.
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

___

### downloadFile

▸ `Static` **downloadFile**(`request`, `init?`, `cacheOptions?`, `progressCallback?`): [`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<`string`\>

Downloads a file into local cache and returns its local uri

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | `RequestInfo` | This defines the resource that you wish to fetch. See [`fetch()` parameters](https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters). |
| `init?` | `RequestInit` | An object containing any custom settings that you want to apply to the request, such as `headers`, `method`. See [`fetch()` parameters](https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters). |
| `cacheOptions?` | [`CacheOptions`](../interfaces/CacheOptions.md) | An object containing cache behaviors for the request. |
| `progressCallback?` | `DownloadProgressCallback` | Use this callback to trace download progress. |

#### Returns

[`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<`string`\>

A Promise that resolve to an URI as `string` that can be used as source (i.e. `src` attribute) of a HTMLElement such as `<img>`.

**`Example`**

download an image with [_cache first_](../enums/CacheStrategy.md#cachefirst) strategy and progress feedback:
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

___

### getCacheURI

▸ `Static` **getCacheURI**(`url`, `cacheName`, `cacheScope`): [`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<`string`\>

Get cache URI for the given url

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | URL of the resource to search |
| `cacheName` | `string` | Name of the cache. If `null` of empty, defaults to global cache for interface assets. |
| `cacheScope` | [`CacheScope`](../enums/CacheScope.md) | Scope of the cached resource. Defaults to [CacheScope.Experience](../enums/CacheScope.md#experience). |

#### Returns

[`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<`string`\>

A Promise that resolve to an URI as `string` that can be used as source (i.e. `src` attribute) of a HTMLElement such as `<img>`.

___

### listCacheEntries

▸ `Static` **listCacheEntries**(`cacheName`, `cacheScope`): [`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<[`CacheEntry`](../interfaces/CacheEntry.md)[]\>

List entries cached in given cache

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cacheName` | `string` | Name of the cache. If `null` of empty, defaults to global cache for interface assets. |
| `cacheScope` | [`CacheScope`](../enums/CacheScope.md) | Scope of the cache entries to list. Defaults to [CacheScope.Experience](../enums/CacheScope.md#experience). |

#### Returns

[`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<[`CacheEntry`](../interfaces/CacheEntry.md)[]\>

A Promise that resolve to an array of [CacheEntry](../interfaces/CacheEntry.md).

___

### removeFromCache

▸ `Static` **removeFromCache**(`url`, `cacheName`, `cacheScope`): [`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<`void`\>

Remove cached data for the given url

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | URL of the resource to remove |
| `cacheName` | `string` | Name of the cache. If `null` of empty, defaults to global cache for interface assets. |
| `cacheScope` | [`CacheScope`](../enums/CacheScope.md) | Scope of the cached data to remove. Defaults to [CacheScope.Experience](../enums/CacheScope.md#experience). |

#### Returns

[`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<`void`\>

A Promise that resolve when data has been removed from cache.

___

### deleteCache

▸ `Static` **deleteCache**(`cacheName`, `cacheScope`, `failOnError?`): [`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<`void`\>

Delete given cache

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `cacheName` | `string` | `undefined` | Name of the cache. If `null` of empty, defaults to global cache for interface assets. |
| `cacheScope` | [`CacheScope`](../enums/CacheScope.md) | `undefined` | Scope of the cache to delete. Defaults to [CacheScope.Experience](../enums/CacheScope.md#experience). |
| `failOnError` | `boolean` | `true` | If `true`, throws `Error` when deletion fails. Otherwise catch error silently. Defaults to `false`. |

#### Returns

[`Promise`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )<`void`\>

a Promise that resolve when cache has been deleted.

**`Throws`**

Error if fails and `failOnError` is `true`.


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/