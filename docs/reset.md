# Handle resets in an Interface Asset

When Experience Generator requests a reset, Player returns an element to its starting values without
creating it again. Bindings between properties continue to work.

Most interface assets can use Player's default reset behavior. This advanced guide is
for assets that need to keep some values, stop delayed work, or update their own results
when a reset occurs.

**Compatibility:** `@ResetValue` requires **Player 8.3.1 or later**. An interface asset
using this decorator cannot be loaded in earlier Player versions. On older Players,
property reset options have no effect and the before/after reset methods are not called
automatically.

## Choose which values reset

Use `resetOptions` on a `@Property` when you need to choose its reset behavior.
If you omit this option, Player uses its default reset behavior.

| Declaration | What happens during a reset |
| --- | --- |
| Writable `@Property` | Returns to the value set in Experience Generator, or its default value if none was set in Experience Generator. |
| Read-only `@Property` | Keeps its current value by default. Your code can update it when needed. |
| `@Property({ ..., resetOptions: { enabled: true } })` | Resets the property, including when it is read-only. |
| `@Property({ ..., resetOptions: { enabled: false } })` | Keeps the property's current value. |
| `@ResetValue({ enabled: false })` on a class variable | Keeps the variable's current value. Use this for variables that are not declared with `@Property` and should not automatically return to their initial value. |

For example, a counter result may need to return to zero each time. A list downloaded
from a web service may need to keep its contents, so it does not have to be downloaded
again. If some values inside the list should reset, update those values in your code
using the method described below.

## Run your own code before and after a reset

Override these methods in your interface asset:

- `beforeResetFromConfiguration()`: stop timers, downloads or other work your code has
  started, before Player changes the element's values.
- `afterResetFromConfiguration()`: update values your code manages, such as a status
  message or the selected item in a list, after Player has reset the element's values.

Always call the matching `super` method, as shown in the
[counter example](./examples/resettable-interface-asset.ts), so the base class can do
its reset work too. Player does not wait for asynchronous work, such as downloads,
started in these methods.

A reset does not automatically stop timers or requests created by your code. Stop them
in `beforeResetFromConfiguration()` and when the asset is disposed. If a request cannot
be stopped, check that its result still belongs to the current round before using it.

`@ResetValue({ enabled: false })` keeps a variable's value but does not stop the work
it refers to. In the example, it keeps the timer reference available until our code
stops the timer and clears the reference.