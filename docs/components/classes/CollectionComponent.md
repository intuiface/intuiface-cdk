# Class: CollectionComponent<T\>

Collection component

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `IntuifaceCollection`<`ElementContainer`\> |

## Hierarchy

- [`ElementComponent`](ElementComponent.md)<`T`\>

  ↳ **`CollectionComponent`**

## Table of contents

### Constructors

- [constructor](CollectionComponent.md#constructor)

### Methods

- [trackByFn](CollectionComponent.md#trackbyfn)

## Constructors

### constructor

• **new CollectionComponent**<`T`\>(`selectionService`, `domSanitizer`, `elementReference`)

Constructor

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `IntuifaceCollection`<`ElementContainer`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `selectionService` | [`SelectionService`](SelectionService.md) |
| `domSanitizer` | `DomSanitizer` |
| `elementReference` | `ElementRef`<`any`\> |

#### Overrides

ElementComponent&lt;T\&gt;.constructor

## Methods

### trackByFn

▸ **trackByFn**(`index`, `item`): `number`

Track by fn

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `number` |
| `item` | `IntuifaceElement` |

#### Returns

`number`


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/