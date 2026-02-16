[**@intuiface/core**](../README.md)

***

# Class: EnvironmentService

Service to expose information about the environment context in which Player is running

## Accessors

### canPromptInstallApp

#### Get Signature

> **get** `static` **canPromptInstallApp**(): `boolean`

Indicates if browser is ready to prompt install app

##### Returns

`boolean`

## Methods

### subscribeToCanPromptInstallChanges()

> `static` **subscribeToCanPromptInstallChanges**(`listener`): `void`

Subscribes to be notified of canPromptInstallApp changes

#### Parameters

##### listener

[`Function`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function)

listener function

#### Returns

`void`

***

### unsubscribeToCanPromptInstallChanges()

> `static` **unsubscribeToCanPromptInstallChanges**(`listener`): `void`

Unsubscribes to be notified of canPromptInstallApp changes

#### Parameters

##### listener

[`Function`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function)

listener function

#### Returns

`void`

***

### promptInstallApp()

> `static` **promptInstallApp**(): `void`

Prompt App installation

#### Returns

`void`


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/