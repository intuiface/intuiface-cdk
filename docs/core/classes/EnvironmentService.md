# Class: EnvironmentService

Service to expose information about the environment context in which Player is running

## Table of contents

### Accessors

- [canPromptInstallApp](EnvironmentService.md#canpromptinstallapp)

### Methods

- [subscribeToCanPromptInstallChanges](EnvironmentService.md#subscribetocanpromptinstallchanges)
- [unsubscribeToCanPromptInstallChanges](EnvironmentService.md#unsubscribetocanpromptinstallchanges)
- [promptInstallApp](EnvironmentService.md#promptinstallapp)

## Accessors

### canPromptInstallApp

• `Static` `get` **canPromptInstallApp**(): `boolean`

Indicates if browser is ready to prompt install app

#### Returns

`boolean`

## Methods

### subscribeToCanPromptInstallChanges

▸ `Static` **subscribeToCanPromptInstallChanges**(`listener`): `void`

Susbscribes to be notified of canPromptInstallApp changes

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `listener` | `Function` | listener function |

#### Returns

`void`

___

### unsubscribeToCanPromptInstallChanges

▸ `Static` **unsubscribeToCanPromptInstallChanges**(`listener`): `void`

Unsusbscribes to be notified of canPromptInstallApp changes

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `listener` | `Function` | listener function |

#### Returns

`void`

___

### promptInstallApp

▸ `Static` **promptInstallApp**(): `void`

Prompt App installation

#### Returns

`void`
