[**@intuiface/core**](../README.md)

***

# Enumeration: CacheStrategy

`Enum` of available cache strategies.

## Enumeration Members

### NetworkOnly

> **NetworkOnly**: `"NetworkOnly"`

Only fetch response from network. _Response will not be cached_.  
Use this when you always want the most up-to-date response and disable cache.

***

### CacheOnly

> **CacheOnly**: `"CacheOnly"`

Only fetch response from cache. _No network request will be sent_.  
Use this when you know data is already cached and you absolutely don't want to update it.

***

### NetworkFirst

> **NetworkFirst**: `"NetworkFirst"`

Make a network request first and fallback with response from cache if it fails.  
Use this when you want up-to-date response but accept cached data as fallback.

***

### CacheFirst

> **CacheFirst**: `"CacheFirst"`

Get response from cache first. If nothing is found, make a network request and cache response.  
Use for performance and you want to avoid making unnecessary network request.


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/