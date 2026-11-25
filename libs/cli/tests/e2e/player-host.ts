import fs from 'fs-extra';
import http from 'http';
import { JSDOM, VirtualConsole } from 'jsdom';
import { AddressInfo } from 'net';
import path from 'path';
import webpack from 'webpack';
import { distCoreDir } from './e2e-utils.js';

/** What the host page returns once the items are loaded (objects of the page, see player-host/player-host.mjs). */
export interface PlayerHostLoad
{
    /** Module exposed by each item, e.g. `modules.Gauge.Gauge` is the class of the Gauge item. */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    modules: Record<string, any>;
    /** Exports of the shared @intuiface/core the items used. */
    usedExports: string[];
    /** The @intuiface/core the host shares. */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    core: any;
}

export interface PlayerHost
{
    /** Load built items (`dist/<name>`), as the Player loads the interface assets of an experience. */
    loadItems: (names: string[]) => Promise<PlayerHostLoad>;
    /** Paths the page requested, e.g. `/dist/Gauge/Gauge.js`. */
    requestedPaths: string[];
    /** Errors of the page: uncaught exceptions, failed loads, console.error. */
    errors: string[];
    close: () => Promise<void>;
}

/**
 * Bundle the host page script with its Module Federation runtime and the built CDK core.
 */
const bundleHostScript = (outputDir: string): Promise<void> => new Promise((resolve, reject) =>
{
    const compiler = webpack({
        mode: 'development',
        devtool: false,
        target: 'web',
        entry: path.join(import.meta.dirname, 'player-host', 'player-host.mjs'),
        output: { path: outputDir, filename: 'host.js' },
        resolve: { alias: { '@intuiface/core': distCoreDir } }
    });
    compiler.run((error, stats) =>
    {
        compiler.close(() =>
        {
            if (error || stats?.hasErrors())
            {
                reject(error ?? new Error(stats?.toString('errors-only')));
                return;
            }
            resolve();
        });
    });
});

/**
 * Open a Player-like host on a workspace: the workspace folder is served over HTTP, and a jsdom page loads the built
 * items with the Module Federation runtime of the Player.
 */
export const openPlayerHost = async (workspaceDir: string): Promise<PlayerHost> =>
{
    await bundleHostScript(path.join(workspaceDir, 'player-host'));

    const requestedPaths: string[] = [];
    const server = http.createServer((request, response) =>
    {
        const requestPath = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
        requestedPaths.push(requestPath);
        const filePath = path.join(workspaceDir, requestPath);
        if (!filePath.startsWith(workspaceDir) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory())
        {
            response.writeHead(404).end();
            return;
        }
        response.writeHead(200, { 'Content-Type': filePath.endsWith('.js') ? 'text/javascript' : 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(response);
    });
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
    const baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}/`;

    const errors: string[] = [];
    const virtualConsole = new VirtualConsole();
    virtualConsole.on('jsdomError', (error: Error & { cause?: Error }) => errors.push(String(error.cause?.stack ?? error.stack ?? error)));
    virtualConsole.on('error', (...args: unknown[]) => errors.push(args.map(String).join(' ')));
    const dom = new JSDOM('<!DOCTYPE html><html><head><script src="player-host/host.js"></script></head></html>', {
        url: baseUrl,
        runScripts: 'dangerously',
        resources: 'usable',
        virtualConsole: virtualConsole
    });
    await new Promise((resolve) => dom.window.addEventListener('load', resolve));

    const page = dom.window as unknown as { loadItems: (items: { name: string; entry: string }[]) => Promise<PlayerHostLoad> };
    return {
        loadItems: (names) => page.loadItems(names.map((name) => ({ name: name, entry: `${baseUrl}dist/${name}/${name}.js` }))),
        requestedPaths: requestedPaths,
        errors: errors,
        close: async () =>
        {
            dom.window.close();
            await new Promise((resolve) => server.close(resolve));
        }
    };
};
