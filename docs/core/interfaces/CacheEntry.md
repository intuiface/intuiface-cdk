[**@intuiface/core**](../README.md) • **Docs**

***

# Interface: CacheEntry

An object containing metadata about an entry in cache.

## Properties

### cacheName

> **cacheName**: `string`

Name of the cache containing this entry.

***

### sourceUrl

> **sourceUrl**: `string`

source URL from where the data was requested.

***

### lastUpdate

> **lastUpdate**: [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

Date of last time entry was updated.

***

### cacheUri?

> `optional` **cacheUri**: `string`

URI of cache entry stored on file system and that can be used as source of HTML elements (such as `<img>`). _Only available when access to file system is possible_ (not for XP as webpage).


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/