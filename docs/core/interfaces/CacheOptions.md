[**@intuiface/core**](../README.md) • **Docs**

***

# Interface: CacheOptions

An object configuring cache options for a request.

## Properties

### strategy

> **strategy**: [`CacheStrategy`](../enumerations/CacheStrategy.md)

Strategy to use when requesting a resource.

***

### cacheName

> **cacheName**: `string`

Name of the cache.  
It's a way to segregate data and easily retrieve cache entries. It can be considered as a folder and can include `/` separator to create sub-caches.  
If `null` or empty, defaults to global cache for interface assets.

***

### cacheScope?

> `optional` **cacheScope**: [`CacheScope`](../enumerations/CacheScope.md)

Indicates if cache is shared between experiences or only available for the current running experience. Defaults to `Experience`.  
`Player` means cache is shared between experiences  
`Experience` means it will be available only for current experience and deleted if experience is removed from devices

***

### ignoreSearch?

> `optional` **ignoreSearch**: `boolean`

Ignore query parameters. Defaults to `false`.

***

### cacheErrorResponse?

> `optional` **cacheErrorResponse**: `boolean`

Enable caching an error response. Defaults to `false`.  
This can be useful for example when resource access requires authentication and you want to clear the cached data if authentication has been denied.

***

### enabledForXPWeb?

> `optional` **enabledForXPWeb**: `boolean`

Enable caching for [XP as a Web page](https://support.intuiface.com/hc/en-us/articles/4407120931218-Details-about-Player-Next-Gen-on-the-Web).  
By default cache is disabled in _XP as a Web page_ and the browser do it according to Cache-Control header in response.  
If `true`, response will be cache through [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache) and browser will not clean it.
_So be careful not to use all user storage_.

***

### enabledForComposer?

> `optional` **enabledForComposer**: `boolean`

Enable caching in Composer's Play mode. Defaults to `false`.


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/