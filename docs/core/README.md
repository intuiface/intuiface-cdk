<p align="center">
    <a href="https://www.intuiface.com">
        <img src="https://assets-global.website-files.com/6090f790a8effe00c12b39d0/6090f790a8effef0002b3c56_Intuiface%20logo%20animated.gif" alt="Intuiface logo" width="200" height="86">
    </a>
</p>

**@intuiface/core** • **Docs**

***

# @intuiface/core

This library will enables you to create custom interface assets that can be used in your Intuiface experiences.

In `@intuiface/core`, we use [TypeScript decorators](https://www.typescriptlang.org/docs/handbook/decorators.html) to declare Properties, Triggers and Actions exposed in Intuiface Composer. You can find all [available decorators](#Decorators) in this documentation.

`@intuiface/core` also exposes services that will help you access low level information (device's id, name, os...), hardware, cache... in an easy and cross-platform way.

Use the [`@intuiface/interface-asset`](../../libs/tools/schematics/interface-asset-schematics/README.md) to create and initialize your project workspace. Then you can use [IntuifaceElement](classes/IntuifaceElement.md) and [`@Asset`](functions/Asset.md) decorator to declare your interface asset and [`@Property`](functions/Property.md), [`@Trigger`](functions/Trigger.md) and [`@Action`](functions/Action.md) decorators to customize it. See [`@Asset`](functions/Asset.md) example for a squeleton class of a custom interface asset.

## Remarks

Before reading how to create interface assets and declare Properties, Triggers, Actions and Parameters, please note that we choose to use the _camelCase_ naming convention.

## Enumerations

- [CacheStrategy](enumerations/CacheStrategy.md)
- [CacheScope](enumerations/CacheScope.md)

## Classes

- [Watchable](classes/Watchable.md)
- [IntuifaceCollection](classes/IntuifaceCollection.md)
- [ElementContainer](classes/ElementContainer.md)
- [IntuifaceElement](classes/IntuifaceElement.md)

## Interfaces

- [IDisposable](interfaces/IDisposable.md)
- [IActionOptions](interfaces/IActionOptions.md)
- [IComputorOptions](interfaces/IComputorOptions.md)
- [IElementOptions](interfaces/IElementOptions.md)
- [IParameterOptions](interfaces/IParameterOptions.md)
- [IPropertyOptions](interfaces/IPropertyOptions.md)
- [ITriggerOptions](interfaces/ITriggerOptions.md)
- [ICollectionConfiguration](interfaces/ICollectionConfiguration.md)
- [CacheEntry](interfaces/CacheEntry.md)
- [CacheOptions](interfaces/CacheOptions.md)
- [DownloadProgress](interfaces/DownloadProgress.md)

## Decorators

- [Action](functions/Action.md)
- [Computor](functions/Computor.md)
- [Asset](functions/Asset.md)
- [Collection](functions/Collection.md)
- [InternalProperty](functions/InternalProperty.md)
- [Parameter](functions/Parameter.md)
- [Property](functions/Property.md)
- [Trigger](functions/Trigger.md)

## Services

- [CacheService](classes/CacheService.md)
- [EnvironmentService](classes/EnvironmentService.md)
- [SystemInfoService](classes/SystemInfoService.md)
- [UsbSerialService](classes/UsbSerialService.md)

## Types

- [Color](classes/Color.md)
- [IConvertibleType](interfaces/IConvertibleType.md)
- [Typeface](interfaces/Typeface.md)
- [Font](classes/Font.md)
- [LinearGradient](classes/LinearGradient.md)
- [Path](classes/Path.md)
- [RadialGradient](classes/RadialGradient.md)
- [Resource](classes/Resource.md)
- [SolidColor](classes/SolidColor.md)
- [Time](classes/Time.md)


## Help
Found a problem, a bug? Or need some help?  
Please do not create an issue in Github! Ask us via our Support page : https://support.intuiface.com/