# Services

`@intuiface/core` exposes services that will help you access low level information (device's id, name, os...), hardware, cache... in an easy and cross-platform way.

## Table of content

- [Cache service](#cache-service)
  - Methods:
    - [fetch()](#fetch)
    - [downloadFile()](#downloadfile)
    - [listCacheEntries()](#listCacheEntries)
    - [deleteCache()](#deletecache)
    - [removeFromCache()](#removefromcache)
    - [getCacheUri()](#getcacheuri)
  - Types:
    - [CacheStrategy](#cachestrategy)
    - [CacheOptions](#cacheoptions)
    - [CacheEntry](#cacheentry)
    - [DownloadProgress](#downloadprogress)
- [Environment service](#environment-service)
- [USB serial service](#usb-serial-service)
- [System-info service](#system-info-service)

___

## Cache service

`CacheService` enhances the [`Fetch API`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) with caching strategy, allowing you to store locally request's responses and files and access them even offline.

### fetch()
`fetch(request, init?, cacheOptions?, progressCallback?): Promise<Response>`

Enhanced global [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/fetch) with caching mechanism. Use fetch when you want to directly use the response content. To get path to a locally cached file, use [`downloadFile()`](#downloadfile) instead.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | `string` \| `Request` | This defines the resource that you wish to fetch. See [`fetch()` parameters](https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters). |
| `init?` | `RequestInit` | An object containing any custom settings that you want to apply to the request, such as `headers`, `method`. See [`fetch()` parameters](https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters). |
| `cacheOptions?` | [`CacheOptions`](#cacheoptions) | An object containing cache behaviors for the request. |
| `progressCallback?` | [`DownloadProgressCallback`](#cacheoptions) | Use this callback to trace download progress. |

#### Returns

`Promise`<[`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)\>

#### Usage
- Fetch a json file with _network first_ strategy:
```ts
try
{
    const response = await CacheService.fetch('https://httpbin.org/get', null, {
        cacheName: 'myCache',
        strategy: CacheStrategy.NetworkFirst
    });

    const json = await response.json();

    // Do something with json
}catch(error){
    console.error(error);
}
```

### downloadFile()

Downloads a file into local cache and returns its local uri
#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | `string` \| `Request` | This defines the resource that you wish to fetch. See [`fetch()` parameters](https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters). |
| `init?` | `RequestInit` | An object containing any custom settings that you want to apply to the request, such as `headers`, `method`. See [`fetch()` parameters](https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters). |
| `cacheOptions?` | [`CacheOptions`](#cacheoptions) | An object containing cache behaviors for the request. |
| `progressCallback?` | [`DownloadProgressCallback`](#cacheoptions) | Use this callback to trace download progress. |


#### Returns

`Promise<string>`: a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that resolve to an URI as `string` that can be used as source (i.e. `src` attribut) of a HTML element such as `<img>`.

#### Usage
- download an image with _cache first_ strategy and progress feedback:
```ts
try
{
    const imageUri = await CacheService.downloadFile('https://httpbin.org/get', null, {
        cacheName: 'myCache',
        strategy: CacheStrategy.CacheFirst
    },
    (progress)=> {
        // compute percentage
        const percent = Math.round(progress.receivedLength / progress.contentLength * 100);
        console.log(`Downloaded ${percent}%`);
    });

    // Do something imageUri
}catch(error){
    console.error(error);
}
```

### listCacheEntries()

List entries cached in given cache

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cacheName` | `string` | Name of the cache |


#### Returns
`Promise<CacheEntry[]>`: a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that resolve to an array of [`CacheEntry`](#cacheentry).

#### Usage
```ts
const entries = await CacheService.listCacheEntries('myCache');
console.table(entries);
```

### deleteCache()

Delete given cache

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cacheName` | `string` | Name of the cache |
| `failOnError?` | `boolean` | If `true`, throws `Error` when deletion fails. Otherwise catch error silently. Defaults to `false`. |

#### Returns
`Promise<void>`: a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that resolve when cache has been deleted.


### removeFromCache()

Remove cached data for the given url

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | URL of the resource to remove |
| `cacheName` | `string` | Name of the cache |

#### Returns
`Promise<void>`: a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that resolve when data has been removed from cache.

### getCacheUri()

Get cache URI for the given url

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | URL of the resource to remove |
| `cacheName` | `string` | Name of the cache |

#### Returns

`Promise<string>`: a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that resolve to an URI as `string` that can be used as source (i.e. `src` attribut) of a HTML element such as `<img>`.

___

### CacheStrategy

`Enum` of available cache strategy
- `NetworkOnly`:  
 Only fetch response from network. Response will not be cached.  
 Use this when you always want the most up-to-date response and disable cache.
- `CacheOnly`:  
 Only fetch response from cache. No network request will be sent.  
 Use this when you know data is already cached and you absolutly don't want to update it.
- `NetworkFirst`:  
Make a network request first and fallback with response from cache if it fails.  
Use this when you want up-to-date response but accept cached data as fallback.  
Cache will be updated with response from network.
- `CacheFirst`:  
Get response from cache first. If nothing is found, make a network request and cache response.  
Use performance and you want to avoid making unecessary network request.


### CacheOptions
An object configuring cache options for a request.
- `strategy`: [`CacheStrategy`](#cachestrategy)  
Strategy to use when requesting a resource
- `cacheName?:string`  
Name of the cache
- `ignoreSearch?: boolean`  
Ignore query parameters. Defaults to `false`.
- `cacheErrorResponse?: boolean`  
Enable caching an error response. Defaults to `false`.
- `enabledForXPWeb?: boolean`  
Enable caching for [XP as a Web page](https://support.intuiface.com/hc/en-us/articles/4407120931218-Details-about-Player-Next-Gen-on-the-Web).  
By default cache is disabled in _XP as a Web page_ and the browser do it according to Cache-Control header in response.
If `true`, response will be cache through [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache) and browser will not clean it. _*So be careful not to use all user storage.*_
- `enabledForComposer?: boolean`  
Enable caching in Composer's Play mode. Defaults to false.


### CacheEntry
An object containing metadata about an entry in cache.

- `cacheName: string`  
Name of the cache containing this entry.
- `sourceUrl: string`  
source URL from where the data was requested.
- `cacheUri?: string`  
URI of cache entry stored on file system and that can be used as source of HTML elements (such as `<img>`). _*Only available when access to file system is possible*_ (not for XP as webpage).
- `lastUpdate: Date`  
 Date of last time entry was updated

### DownloadProgress
- `receivedLength: number`  
Number of bytes received for this download
- `contentLength: number`  
Number of total bytes to download from the `Response` content.


___

## Environment service


## USB serial service


## System-info service

