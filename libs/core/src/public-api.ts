/**
 * This library will enables you to create custom interface assets that can be used in your Intuiface experiences.
 * 
 * In `@intuiface/core`, we use [TypeScript decorators](https://www.typescriptlang.org/docs/handbook/decorators.html) to declare Properties, Triggers and Actions exposed in Intuiface Composer. You can find all [available decorators](#Decorators) in this documentation.
 * 
 * `@intuiface/core` also exposes services that will help you access low level information (device's id, name, os...), hardware, cache... in an easy and cross-platform way.
 * 
 * Use the [`@intuiface/interface-asset`](../../libs/tools/schematics/interface-asset-schematics/README.md) to create and initialize your project workspace. Then you can use {@link IntuifaceElement} and {@link Asset | `@Asset`} decorator to declare your interface asset and {@link Property | `@Property`}, {@link Trigger | `@Trigger`} and {@link Action | `@Action`} decorators to customize it. See {@link Asset | `@Asset`} example for a squeleton class of a custom interface asset.
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
export { Time } from './lib/types/time.type';
export { Typeface, Typeface as IFont, Font } from './lib/types/font.type';
export { Resource } from './lib/types/resource.type';
export { IConvertibleType } from './lib/types/convertible.type';
