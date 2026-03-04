[**@intuiface/components**](../README.md)

***

# Class: SharingService

Service to manage font.

## Methods

### registerSharingQueue()

> `static` **registerSharingQueue**(`sharingQueue`): `void`

Register a Sharing Queue

#### Parameters

##### sharingQueue

`SharingBehavior`

#### Returns

`void`

***

### unregisterSharingQueue()

> `static` **unregisterSharingQueue**(`sharingQueue`): `void`

Unregister sharing queue

#### Parameters

##### sharingQueue

`SharingBehavior`

#### Returns

`void`

***

### addItemToSharingQueue()

> `static` **addItemToSharingQueue**(`item`, `sharingQueue`): [`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`boolean`\>

Add item to sharing queues

#### Parameters

##### item

`Resource`

##### sharingQueue

`string` | `ExportedList`

#### Returns

[`Promise`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)\<`boolean`\>

boolean to precise if the item is added

***

### removeItemFromSharingQueue()

> `static` **removeItemFromSharingQueue**(`item`, `sharingQueue`): `void`

Remove item from sharing queues

#### Parameters

##### item

`Resource`

##### sharingQueue

`string` | `ExportedList`

#### Returns

`void`


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/