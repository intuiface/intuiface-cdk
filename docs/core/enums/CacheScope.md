# Enumeration: CacheScope

`Enum` that defines if a cache is available across all experiences or only the current one.

## Table of contents

### Enumeration Members

- [Player](CacheScope.md#player)
- [Experience](CacheScope.md#experience)

## Enumeration Members

### Player

• **Player** = ``"player"``

Player scope means cache will be shared between all experiences.

___

### Experience

• **Experience** = ``"experience"``

Experience scope means cache will be available only for current experience.

**`Remarks`**

When deleting experience, Player will delete all cache associated with this experience.


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/