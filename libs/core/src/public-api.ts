/**
 * This library will enables you to create custom interface assets that can be used in your Intuiface experiences.
 * 
 * In `@intuiface/core`, we use [TypeScript decorators](https://www.typescriptlang.org/docs/handbook/decorators.html) to declare interface assets, binding converters, Properties, Triggers, Actions and Parameters exposed in Intuiface Composer. You can find all [available decorators](#Decorators) in this documentation.
 * 
 * `@intuiface/core` also exposes services that will help you access low level information (device's id, name, os...), hardware, cache... in an easy and cross-platform way.
 * 
 * Use the [`@intuiface/interface-asset`](../../libs/tools/schematics/interface-asset-schematics/README.md) to create and initialize an interface asset workspace, or [`@intuiface/binding-converter`](../../libs/tools/schematics/binding-converter-schematics/README.md) to create a binding converter workspace. Then you can use {@link IntuifaceElement} and {@link Asset | `@Asset`} decorator to declare your interface asset with {@link Property | `@Property`}, {@link Trigger | `@Trigger`}, {@link Action | `@Action`} and {@link Parameter | `@Parameter`} decorators, or {@link Converter | `@Converter`} to declare a binding converter using {@link Parameter | `@Parameter`}.
 * 
 * @remarks Before reading how to create interface assets and declare Properties, Triggers, Actions and Parameters, please note that we choose to use the _camelCase_ naming convention.
 * 
 * 
 * 
 *
 * @module
 */
export { Property, IPropertyOptions } from './lib/decorators/property';
export { InternalProperty } from './lib/decorators/internal-property';
export { Trigger, ITriggerOptions } from './lib/decorators/trigger';
export { Action, IActionOptions } from './lib/decorators/action';
export { Converter, IConverterOptions } from './lib/decorators/converter';
export { Parameter, IParameterOptions } from './lib/decorators/parameter';
export { Asset, Collection, Inject, DoNotInjectMethod, IElementOptions } from './lib/decorators/element.decorator';
export { Computor, IComputorOptions } from './lib/decorators/computor';
export { IntuifaceElement } from './lib/elements/element';
export { ElementContainer } from './lib/elements/container';
export { IntuifaceCollection, ICollectionConfiguration } from './lib/elements/collection';
export { Watchable } from './lib/base/watchable';
export { IDisposable } from './lib/base/disposable';

// Services
export { EnvironmentService } from './lib/services/environment.service';
export { UsbSerialService } from './lib/services/usb.serial.service';
export { SystemInfoService } from './lib/services/system-info.service';
export { CacheService, CacheStrategy, CacheOptions, CacheEntry, CacheScope, DownloadProgress, DownloadProgressCallback } from './lib/services/cache.service';

// types
export { Path } from './lib/types/path.type';
export { Color } from './lib/types/color.type';
export { SolidColor } from './lib/types/solid-color.type';
export { LinearGradient } from './lib/types/linear-gradient.type';
export { RadialGradient } from './lib/types/radial-gradient.type';
export { Time } from './lib/types/time.type';
export { Typeface, Typeface as IFont, Font } from './lib/types/font.type';
export { Resource } from './lib/types/resource.type';
export { IConvertibleType } from './lib/types/convertible.type';
