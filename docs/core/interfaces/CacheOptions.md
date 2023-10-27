# Interface: CacheOptions

Cache options

## Table of contents

### Properties

- [strategy](CacheOptions.md#strategy)
- [cacheName](CacheOptions.md#cachename)
- [cacheScope](CacheOptions.md#cachescope)
- [ignoreSearch](CacheOptions.md#ignoresearch)
- [cacheErrorResponse](CacheOptions.md#cacheerrorresponse)
- [enabledForXPWeb](CacheOptions.md#enabledforxpweb)
- [enabledForComposer](CacheOptions.md#enabledforcomposer)

## Properties

### strategy

• **strategy**: [`CacheStrategy`](../enums/CacheStrategy.md)

Strategy to use when requesting a resource

___

### cacheName

• **cacheName**: `string`

Name of the cache

___

### cacheScope

• `Optional` **cacheScope**: [`CacheScope`](../enums/CacheScope.md)

Indicates if cache is shared between experiences or only available for the current running experience.
`player` means cache is shared between experiences
`experience` means it will be available only for current experience and deleted if experience is removed from devices

___

### ignoreSearch

• `Optional` **ignoreSearch**: `boolean`

Ignore query parameters. Defaults to false.

___

### cacheErrorResponse

• `Optional` **cacheErrorResponse**: `boolean`

Enable caching an error response. Defaults to false.

___

### enabledForXPWeb

• `Optional` **enabledForXPWeb**: `boolean`

Enable caching for XP as a Web page.
By default cache is disabled and the browser do it according to Cache-Control header in response.
If true, response will be cache through Cache API and browser will not clean it.
So be careful not to use all user storage.

___

### enabledForComposer

• `Optional` **enabledForComposer**: `boolean`

Enable caching in Composer's Play mode. Defaults to false.
