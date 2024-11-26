const metas = new Map();
const map = [].map;
const some = [].some;
const hasOwnProperty = {}.hasOwnProperty;
const origin = "https://cdn.jsdelivr.net/npm/";
const identifierRe = /^((?:@[^/@]+\/)?[^/@]+)(?:@([^/]+))?(?:\/(.*))?$/;
const versionRe = /^\d+\.\d+\.\d+(-[\w-.+]+)?$/;
const extensionRe = /\.[^/]*$/;
const mains = ["unpkg", "jsdelivr", "browser", "main"];

export class RequireError extends Error {
    constructor(message) {
        super(message);
        this.name = 'RequireError';
    }
}

function main(meta) {
    for (const key of mains) {
        const value = meta[key];
        if (typeof value === "string") {
            return extensionRe.test(value) ? value : `${value}.js`;
        }
    }
}

function parseIdentifier(identifier) {
    const match = identifierRe.exec(identifier);
    return match && {
        name: match[1],
        version: match[2],
        path: match[3],
    };
}

function resolveMeta(target) {
    const url = `${origin}${target.name}${target.version ? `@${target.version}` : ""}/package.json`;
    let meta = metas.get(url);
    if (!meta) {
        metas.set(
            url,
            meta = fetch(url).then(response => {
                if (!response.ok) throw new RequireError("unable to load package.json");
                if (response.redirected && !metas.has(response.url)) metas.set(response.url, meta);
                return response.json();
            })
        );
    }
    return meta;
}

async function resolve(name, base) {
    if (name.startsWith(origin)) name = name.substring(origin.length);
    if (/^(\w+:)|\/\//i.test(name)) return name;
    if (/^[.]{0,2}\//i.test(name)) return new URL(name, base == null ? location : base).href;
    if (!name.length || /^[\s._]/.test(name) || /\s$/.test(name)) throw new RequireError("illegal name");
    const target = parseIdentifier(name);
    if (!target) return `${origin}${name}`;
    if (!target.version && base != null && base.startsWith(origin)) {
        const meta = await resolveMeta(parseIdentifier(base.substring(origin.length)));
        target.version = meta.dependencies && meta.dependencies[target.name] || meta.peerDependencies && meta.peerDependencies[target.name];
    }
    if (target.path && !extensionRe.test(target.path)) target.path += ".js";
    if (target.path && target.version && versionRe.test(target.version)) return `${origin}${target.name}@${target.version}/${target.path}`;
    const meta = await resolveMeta(target);
    return `${origin}${meta.name}@${meta.version}/${target.path || main(meta) || "index.js"}`;
}

export var require = requireFrom(resolve);

export function requireFrom(resolver) {
    const cache = new Map();

    function requireAbsolute(url) {
        if (typeof url !== "string") return url;
        let module = cache.get(url);
        if (!module) {
            module = new Promise(async (resolve, reject) => {
                try {
                    const response = await fetch(url);
                    if (!response.ok) throw new RequireError(`Unable to fetch module from ${url}`);
                    const scriptContent = await response.text();

                    const moduleQueue = [];
                    const moduleDefine = createDefine(moduleQueue);

                    const moduleFunction = new Function('define', scriptContent);

                    moduleFunction(moduleDefine);

                    const moduleFactory = moduleQueue.shift();
                    if (typeof moduleFactory !== 'function') {
                        throw new RequireError(`Module did not call define() and cannot be loaded from ${url}`);
                    }

                    const moduleExports = await moduleFactory(requireRelative(url));
                    resolve(moduleExports);
                } catch (error) {
                    console.error(error);
                    reject(error instanceof RequireError ? error : new RequireError(`Error loading module from ${url}`));
                }
            });
            cache.set(url, module);
        }
        return module;
    }

    function requireRelative(base) {
        return name => Promise.resolve(resolver(name, base)).then(requireAbsolute);
    }

    function requireAlias(aliases) {
        return requireFrom((name, base) => {
            if (name in aliases) {
                name = aliases[name];
                base = null;
                if (typeof name !== "string") return name;
            }
            return resolver(name, base);
        });
    }

    function require(name) {
        return arguments.length > 1
            ? Promise.all(map.call(arguments, requireRelative(null))).then(merge)
            : requireRelative(null)(name);
    }

    require.alias = requireAlias;
    require.resolve = resolver;

    return require;
}

function merge(modules) {
    const o = {};
    for (const m of modules) {
        for (const k in m) {
            if (hasOwnProperty.call(m, k)) {
                if (m[k] == null) Object.defineProperty(o, k, { get: getter(m, k) });
                else o[k] = m[k];
            }
        }
    }
    return o;
}

function getter(object, name) {
    return () => object[name];
}

function isbuiltin(name) {
    name = name + "";
    return name === "exports" || name === "module";
}

function createDefine(queue) {
    function define(name, dependencies, factory) {
        const n = arguments.length;
        if (n < 2) factory = name, dependencies = [];
        else if (n < 3) factory = dependencies, dependencies = typeof name === "string" ? [] : name;
        queue.push(some.call(dependencies, isbuiltin) ? require => {
            const exports = {};
            const module = { exports };
            return Promise.all(map.call(dependencies, name => {
                name = name + "";
                return name === "exports" ? exports : name === "module" ? module : require(name);
            })).then(dependencies => {
                factory.apply(null, dependencies);
                return module.exports;
            });
        } : require => {
            return Promise.all(map.call(dependencies, require)).then(dependencies => {
                return typeof factory === "function" ? factory.apply(null, dependencies) : factory;
            });
        });
    }

    define.amd = {};
    return define;
}