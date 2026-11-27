// Preloaded with `node --import` by the e2e tests: run the CLI as on Node.js 18, where it must stop with the version
// message before loading any package (review R10: on an old Node.js, a package may not even load).
import { registerHooks } from 'node:module';

Object.defineProperty(process, 'version', { value: 'v18.20.0' });

registerHooks({
    resolve(specifier, context, nextResolve)
    {
        const isPackage = !/^(\.{1,2}\/|\/|node:|file:|data:)/.test(specifier);
        if (isPackage && context.parentURL != null)
        {
            throw new Error(`the CLI loaded '${specifier}' before checking the Node.js version`);
        }
        return nextResolve(specifier, context);
    }
});
