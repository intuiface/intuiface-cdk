<p align="center">
    <a href="https://www.intuiface.com">
        <img src="https://assets-global.website-files.com/6090f790a8effe00c12b39d0/6090f790a8effef0002b3c56_Intuiface%20logo%20animated.gif" alt="Intuiface logo" width="200" height="86">
    </a>
</p>

**@intuiface/core**

***

# @intuiface/core

This library will enables you to create custom interface assets that can be used in your Intuiface experiences.

In `@intuiface/core`, we use [TypeScript decorators](https://www.typescriptlang.org/docs/handbook/decorators.html) to declare interface assets, binding converters, Properties, Triggers, Actions and Parameters exposed in Intuiface Composer. You can find all [available decorators](#Decorators) in this documentation.

`@intuiface/core` also exposes services that will help you access low level information (device's id, name, os...), hardware, cache... in an easy and cross-platform way.

Use the [`@intuiface/interface-asset`](../../libs/tools/schematics/interface-asset-schematics/README.md) to create and initialize an interface asset workspace, or [`@intuiface/binding-converter`](../../libs/tools/schematics/binding-converter-schematics/README.md) to create a binding converter workspace. Then you can use [IntuifaceElement](/docs/core/classes/IntuifaceElement.md) and [\`@Asset\`](/docs/core/functions/Asset.md) decorator to declare your interface asset with [\`@Property\`](/docs/core/functions/Property.md), [\`@Trigger\`](/docs/core/functions/Trigger.md), [\`@Action\`](/docs/core/functions/Action.md) and [\`@Parameter\`](/docs/core/functions/Parameter.md) decorators, or [\`@Converter\`](/docs/core/functions/Converter.md) to declare a binding converter using [\`@Parameter\`](/docs/core/functions/Parameter.md).

## Remarks

Before reading how to create interface assets and declare Properties, Triggers, Actions and Parameters, please note that we choose to use the _camelCase_ naming convention.

## Enumerations

- [CacheStrategy](/docs/core/enumerations/CacheStrategy.md)
- [CacheScope](/docs/core/enumerations/CacheScope.md)

## Classes

- [Watchable](/docs/core/classes/Watchable.md)
- [IntuifaceCollection](/docs/core/classes/IntuifaceCollection.md)
- [ElementContainer](/docs/core/classes/ElementContainer.md)
- [IntuifaceElement](/docs/core/classes/IntuifaceElement.md)

## Interfaces

- [IDisposable](/docs/core/interfaces/IDisposable.md)
- [IActionOptions](/docs/core/interfaces/IActionOptions.md)
- [IComputorOptions](/docs/core/interfaces/IComputorOptions.md)
- [IConverterOptions](/docs/core/interfaces/IConverterOptions.md)
- [IElementOptions](/docs/core/interfaces/IElementOptions.md)
- [IParameterOptions](/docs/core/interfaces/IParameterOptions.md)
- [IPropertyOptions](/docs/core/interfaces/IPropertyOptions.md)
- [ITriggerOptions](/docs/core/interfaces/ITriggerOptions.md)
- [ICollectionConfiguration](/docs/core/interfaces/ICollectionConfiguration.md)
- [CacheEntry](/docs/core/interfaces/CacheEntry.md)
- [CacheOptions](/docs/core/interfaces/CacheOptions.md)
- [DownloadProgress](/docs/core/interfaces/DownloadProgress.md)

## Decorators

- [Action](/docs/core/functions/Action.md)
- [Computor](/docs/core/functions/Computor.md)
- [Converter](/docs/core/functions/Converter.md)
- [Asset](/docs/core/functions/Asset.md)
- [Collection](/docs/core/functions/Collection.md)
- [InternalProperty](/docs/core/functions/InternalProperty.md)
- [Parameter](/docs/core/functions/Parameter.md)
- [Property](/docs/core/functions/Property.md)
- [Trigger](/docs/core/functions/Trigger.md)

## Services

- [CacheService](/docs/core/classes/CacheService.md)
- [EnvironmentService](/docs/core/classes/EnvironmentService.md)
- [SystemInfoService](/docs/core/classes/SystemInfoService.md)
- [UsbSerialService](/docs/core/classes/UsbSerialService.md)

## Types

- [Color](/docs/core/classes/Color.md)
- [IConvertibleType](/docs/core/interfaces/IConvertibleType.md)
- [Typeface](/docs/core/interfaces/Typeface.md)
- [Font](/docs/core/classes/Font.md)
- [LinearGradient](/docs/core/classes/LinearGradient.md)
- [Path](/docs/core/classes/Path.md)
- [RadialGradient](/docs/core/classes/RadialGradient.md)
- [Resource](/docs/core/classes/Resource.md)
- [SolidColor](/docs/core/classes/SolidColor.md)
- [Time](/docs/core/classes/Time.md)


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/