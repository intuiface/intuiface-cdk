// Page script of a Player-like host, bundled by the e2e tests and run in a jsdom page.
// It loads items built by the CLI as the Intuiface Player does (ExperienceComponent.importPlugins in intuiface-player):
// with the same Module Federation runtime and `init` options, then `loadRemote('<name>/<name>')`.
// The Player shares its own implementation of @intuiface/core; this host shares the CDK one, and records which of its
// exports the items use.
import { init, loadRemote } from '@module-federation/runtime';
import * as IntuifaceCore from '@intuiface/core';

// Globals the decorators of the CDK core fill, as the CLI sets them before loading an item
Object.assign(globalThis, {
    intuiface_ifd_name: 'PlayerHost',
    intuiface_build_type: 'interface-asset',
    intuiface_ifd_classes: [],
    intuiface_ifd_properties: {},
    intuiface_ifd_actions: {},
    intuiface_ifd_params: {},
    intuiface_ifd_triggers: {}
});

const usedExports = new Set();
const sharedCore = new Proxy(IntuifaceCore, {
    get: (target, key) =>
    {
        if (typeof key === 'string')
        {
            usedExports.add(key);
        }
        return target[key];
    }
});

/**
 * Load items, as the Player loads the interface assets of an experience.
 * @param {{ name: string, entry: string }[]} items name and URL of the remote entry (`<name>.js`) of each item
 * @returns the module each item exposes, the exports of the shared core the items used, and that core
 */
window.loadItems = async (items) =>
{
    init({
        name: '@intuiface/player',
        remotes: items.map((item) => ({ name: item.name, entry: item.entry, alias: item.name })),
        shared: {
            '@intuiface/core': {
                lib: () => sharedCore,
                shareConfig: {
                    singleton: true,
                    strictVersion: false,
                    requiredVersion: false
                }
            }
        }
    });

    const modules = {};
    for (const item of items)
    {
        modules[item.name] = await loadRemote(`${item.name}/${item.name}`);
    }
    return { modules, usedExports: [...usedExports], core: IntuifaceCore };
};
