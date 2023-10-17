# Class: CacheService

`CacheService` enhances the [`Fetch API`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) with caching strategy, allowing you to store locally request's responses and files and access them even offline.

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

▸ `Static` **fetch**(`request`, `init?`, `cacheOptions?`, `progressCallback?`): `Promise`<`Response`\>

Enhanced global [`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/fetch) with caching mechanism. Use fetch when you want to directly use the response content. To get path to a locally cached file, use [downloadFile](CacheService.md#downloadfile) instead.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | `RequestInfo` | This defines the resource that you wish to fetch. See [`fetch()` parameters](https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters). |
| `init?` | `RequestInit` | An object containing any custom settings that you want to apply to the request, such as `headers`, `method`. See [`fetch()` parameters](https://developer.mozilla.org/en-US/docs/Web/API/fetch#parameters). |
| `cacheOptions?` | [`CacheOptions`](../interfaces/CacheOptions.md) | An object containing cache behaviors for the request. |
| `progressCallback?` | `DownloadProgressCallback` | Use this callback to trace download progress. |

#### Returns

`Promise`<`Response`\>

___

### downloadFile

▸ `Static` **downloadFile**(`request`, `init?`, `cacheOptions?`, `progressCallback?`): `Promise`<`string`\>

Downloads a file into local cache and returns its local uri

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | `RequestInfo` |
| `init?` | `RequestInit` |
| `cacheOptions?` | [`CacheOptions`](../interfaces/CacheOptions.md) |
| `progressCallback?` | `DownloadProgressCallback` |

#### Returns

`Promise`<`string`\>

___

### getCacheURI

▸ `Static` **getCacheURI**(`url`, `cacheName`, `cacheScope`): `Promise`<`string`\>

Get cache URI for the given url

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `cacheName` | `string` |
| `cacheScope` | [`CacheScope`](../enums/CacheScope.md) |

#### Returns

`Promise`<`string`\>

___

### listCacheEntries

▸ `Static` **listCacheEntries**(`cacheName`, `cacheScope`): `Promise`<[`CacheEntry`](../interfaces/CacheEntry.md)[]\>

List entries cached in given cache

#### Parameters

| Name | Type |
| :------ | :------ |
| `cacheName` | `string` |
| `cacheScope` | [`CacheScope`](../enums/CacheScope.md) |

#### Returns

`Promise`<[`CacheEntry`](../interfaces/CacheEntry.md)[]\>

___

### removeFromCache

▸ `Static` **removeFromCache**(`url`, `cacheName`, `cacheScope`): `Promise`<`void`\>

Remove cached data for the given url

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `cacheName` | `string` |
| `cacheScope` | [`CacheScope`](../enums/CacheScope.md) |

#### Returns

`Promise`<`void`\>

___

### deleteCache

▸ `Static` **deleteCache**(`cacheName`, `cacheScope`, `failOnError?`): `Promise`<`void`\>

Delete given cache

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `cacheName` | `string` | `undefined` |  |
| `cacheScope` | [`CacheScope`](../enums/CacheScope.md) | `undefined` |  |
| `failOnError` | `boolean` | `true` | if true, throw PlayerError when delete fails. |

#### Returns

`Promise`<`void`\>
