# Changelog

## [2.0.0](https://github.com/intuiface/intuiface-cdk/compare/v1.4.0...v2.0.0) (2025-04-01)


### ⚠ BREAKING CHANGES

* **core:** remove deprecated callbacks in usb serial service and work with promises

### Features

* **cli:** add new intuiface-cli to build interface asset project ([#86](https://github.com/intuiface/intuiface-cdk/issues/86)) ([974365f](https://github.com/intuiface/intuiface-cdk/commit/974365fedb45d16906adb111786dd214b6ec1287))
* **core:** Manage auto generated setter action ([#83](https://github.com/intuiface/intuiface-cdk/issues/83)) ([c0a5ef6](https://github.com/intuiface/intuiface-cdk/commit/c0a5ef6597513e1cc9a151eb70b13b9464659e17))
* update angular to version 17 ([#82](https://github.com/intuiface/intuiface-cdk/issues/82)) ([d7c73ff](https://github.com/intuiface/intuiface-cdk/commit/d7c73ff933f11421a30e3ef2b4cd9927905e1994))


### Bug Fixes

* **core:** add default values to parameters in ifd file ([#87](https://github.com/intuiface/intuiface-cdk/issues/87)) ([7a5ffda](https://github.com/intuiface/intuiface-cdk/commit/7a5ffda4da2d5b0c4beb072f7ed97685dd858a8c))
* **core:** expose `getInstance()` on system-info.service ([#84](https://github.com/intuiface/intuiface-cdk/issues/84)) ([02d4cfe](https://github.com/intuiface/intuiface-cdk/commit/02d4cfeee6797e040b89170d9159acdeb56ae87f))
* **interface-asset:** PN-3098: Can't build an IA with the CDK and Nodejs 20 and 22 ([d7c73ff](https://github.com/intuiface/intuiface-cdk/commit/d7c73ff933f11421a30e3ef2b4cd9927905e1994))


### Code Refactoring

* **core:** remove deprecated callbacks in usb serial service and work with promises ([d7c73ff](https://github.com/intuiface/intuiface-cdk/commit/d7c73ff933f11421a30e3ef2b4cd9927905e1994))

## [1.4.0](https://github.com/intuiface/intuiface-cdk/compare/v1.3.1...v1.4.0) (2024-08-28)


### Features

* **core:** manage complex object type in property ([#78](https://github.com/intuiface/intuiface-cdk/issues/78)) ([8740ba6](https://github.com/intuiface/intuiface-cdk/commit/8740ba61070c88240ed2098dae111f8cf1655079))
* **interface-asset:** Allow usage of `window` in interface asset ([#79](https://github.com/intuiface/intuiface-cdk/issues/79)) ([e2f4fc6](https://github.com/intuiface/intuiface-cdk/commit/e2f4fc6a00b2ae46a8c18d082a334c1b3651b72a))

## [1.3.1](https://github.com/intuiface/intuiface-cdk/compare/v1.3.0...v1.3.1) (2024-06-05)


### Bug Fixes

* **interface-asset:** Adds an example parameter to the Trigger ([#74](https://github.com/intuiface/intuiface-cdk/issues/74)) ([bd11688](https://github.com/intuiface/intuiface-cdk/commit/bd11688b68e2f01f4a7a33bd17629d7f5cbf8b77))

## [1.3.0](https://github.com/intuiface/intuiface-cdk/compare/v1.2.0...v1.3.0) (2023-12-21)


### Features

* **interface-asset:** Add Category property to Asset and Collections ([#67](https://github.com/intuiface/intuiface-cdk/issues/67)) ([fe5aafc](https://github.com/intuiface/intuiface-cdk/commit/fe5aafc87ad3301ca4b4e456645e98e2b0395b8f))


### Code Refactoring

* **core:** mark getInstance of USBSerialService as deprecated and expose createInstance ([#69](https://github.com/intuiface/intuiface-cdk/issues/69)) ([f435f3a](https://github.com/intuiface/intuiface-cdk/commit/f435f3ad3fb0a30a824dfa23e6cf71eae1cac362))

## [1.2.0](https://github.com/intuiface/intuiface-cdk/compare/v1.1.2...v1.2.0) (2023-11-15)


### Features

* **core:** Add color types ([99576f7](https://github.com/intuiface/intuiface-cdk/commit/99576f781e45897bfa1ea2bb1c9e2a31e80140de))
* **core:** Fix color types ([8e153a9](https://github.com/intuiface/intuiface-cdk/commit/8e153a9ef0facc6bc928f53b092be732ceed8088))
* **core:** Update solid color type ([fe90e83](https://github.com/intuiface/intuiface-cdk/commit/fe90e83edea790d279a8807e15a1af6183c475d4))
* Update Angular 16 ([de7bc7c](https://github.com/intuiface/intuiface-cdk/commit/de7bc7c92dccf96b1dac013ce68a11b11f970ffb))


### Bug Fixes

* **core:** PN-2933 use displayName in Action ([2c150b1](https://github.com/intuiface/intuiface-cdk/commit/2c150b125919236eee3eab98253c88961fd6adca))
* **core:** PN-3170 Add IA Title/Description, Add Description for all decorators ([09e729c](https://github.com/intuiface/intuiface-cdk/commit/09e729ce65fcb202c89cc968ab09949ea8cf7427))
* **interface-asset:** apply camelCase naming convention with ESLint ([00e6155](https://github.com/intuiface/intuiface-cdk/commit/00e6155682b1ca31066a110c4919212b423dd890))


### Dependencies

* **intuiface-cdk:** fix missing deps ([8162ec6](https://github.com/intuiface/intuiface-cdk/commit/8162ec6d5983241af875cf799978793f1afc6f6b))
* **intuiface-cdk:** update nx and angular to 16.10.0 ([176a53f](https://github.com/intuiface/intuiface-cdk/commit/176a53fde11e95038af2b0dfb5ca042c5f760f18))

## [1.1.2](https://github.com/intuiface/intuiface-cdk/compare/v1.1.1...v1.1.2) (2023-01-26)


### Bug Fixes

* **custom-asset:** update generation of custom asset ([adef5ae](https://github.com/intuiface/intuiface-cdk/commit/adef5ae748f701f39bcf4bfb372274e6c54437e6))
* **intuiface-cdk:** add 'deps' option for commit messages ([87279c0](https://github.com/intuiface/intuiface-cdk/commit/87279c0b7efe5cf9032114ebb4bc9114033252c2))


### Dependencies

* **intuiface-cdk:** clean packages ([adef5ae](https://github.com/intuiface/intuiface-cdk/commit/adef5ae748f701f39bcf4bfb372274e6c54437e6))
* **intuiface-cdk:** update nodejs & github actions ([adef5ae](https://github.com/intuiface/intuiface-cdk/commit/adef5ae748f701f39bcf4bfb372274e6c54437e6))
* **intuiface-cdk:** update packages and angular 14 ([adef5ae](https://github.com/intuiface/intuiface-cdk/commit/adef5ae748f701f39bcf4bfb372274e6c54437e6))

## [1.1.1](https://github.com/intuiface/intuiface-cdk/compare/v1.1.0...v1.1.1) (2022-12-01)


### Bug Fixes

* **interface-asset:** AbortSignal duplication when building IA ([#53](https://github.com/intuiface/intuiface-cdk/issues/53)) ([3c2506c](https://github.com/intuiface/intuiface-cdk/commit/3c2506c97d927293f772c57150fb52e8d334297d))

## [1.1.0](https://github.com/intuiface/intuiface-cdk/compare/v1.0.3...v1.1.0) (2022-11-22)


### Features

* **core:** add cacheScope option for CacheService ([0edfe0c](https://github.com/intuiface/intuiface-cdk/commit/0edfe0c990bc2e5bfe7a10ad914a4fad5cc2a8aa))
* **core:** expose CacheService ([112d963](https://github.com/intuiface/intuiface-cdk/commit/112d963309cb2ea2e8bc3e510911a471c5615c87))
* **interface-asset:** include timestamp in ifd version to increase at each build ([af238e2](https://github.com/intuiface/intuiface-cdk/commit/af238e2c1e740e54dc979e80a669c6b7792578b9))


### Bug Fixes

* **core:** generate correct syntax in ifd file for array of primitive ([9b0a3d2](https://github.com/intuiface/intuiface-cdk/commit/9b0a3d2fadc1f80041779c6c20331651cb4b4353))

## [1.0.3](https://github.com/intuiface/intuiface-cdk/compare/v1.0.2...v1.0.3) (2022-09-21)


### Bug Fixes

* **interface-asset:** Change initialization of workspace file for schematics ([b728cf8](https://github.com/intuiface/intuiface-cdk/commit/b728cf8343de7ef5e5c8c193cb9b3ab69bfb9421))

## [1.0.2](https://github.com/intuiface/intuiface-cdk/compare/v1.0.1...v1.0.2) (2022-09-21)


### Bug Fixes

* **interface-asset:** remove .vscode folder from gitignore ([01cc0dc](https://github.com/intuiface/intuiface-cdk/commit/01cc0dcc33292d81ef1245473f1a87270b9aa3f8))

## [1.0.1](https://github.com/intuiface/intuiface-cdk/compare/v1.0.0...v1.0.1) (2022-09-08)


### Bug Fixes

* **intuiface-cdk:** add shx to dev deps ([8d36560](https://github.com/intuiface/intuiface-cdk/commit/8d3656049a6db825435f5fa162797055f735c625))


### Code Refactoring

* **core:** change trigger propagation parameters ([be2bc81](https://github.com/intuiface/intuiface-cdk/commit/be2bc81747bf5b0acb081e3bae85b161663231df))

## 1.0.0 (2022-08-24)

* **intuiface-cdk:** release 1.0.0 ([3e36b15](https://github.com/intuiface/intuiface-cdk/commit/3e36b15b1126bf3a83bccf476416ed5b3f84973c))
