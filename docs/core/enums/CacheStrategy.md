# Enumeration: CacheStrategy

Cache strategies.

## Table of contents

### Enumeration Members

- [NetworkOnly](CacheStrategy.md#networkonly)
- [CacheOnly](CacheStrategy.md#cacheonly)
- [NetworkFirst](CacheStrategy.md#networkfirst)
- [CacheFirst](CacheStrategy.md#cachefirst)

## Enumeration Members

### NetworkOnly

• **NetworkOnly** = ``"NetworkOnly"``

Only fetch response from network. Response will not be cached.
Use this when you always want the most up-to-date response and disable cache.

___

### CacheOnly

• **CacheOnly** = ``"CacheOnly"``

Only fetch response from cache. No network request will be sent.
Use this when you know data is already cached and you absolutly don't want to update it.

___

### NetworkFirst

• **NetworkFirst** = ``"NetworkFirst"``

Make a network request first and fallback with response from cache if it fails.
Use this when you want up-to-date response but accept cached data as fallback.
Cache will be updated with response from network.

___

### CacheFirst

• **CacheFirst** = ``"CacheFirst"``

Get response from cache first. If nothing is found, make a network request and cache response.
Use performance and you want to avoid making unecessary network request.
