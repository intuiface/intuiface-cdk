// Preloaded with `node --import` by the e2e tests: fail if the CLI loads jsdom (slow to import, only needed by build).
import { registerHooks } from 'node:module';

registerHooks({
    resolve(specifier, context, nextResolve)
    {
        if (specifier === 'jsdom')
        {
            throw new Error('jsdom must only be loaded by build');
        }
        return nextResolve(specifier, context);
    }
});
