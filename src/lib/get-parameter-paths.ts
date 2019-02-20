export default function getPaths(argv:any) {
    const paths = argv.prefixPaths;

    if (!Array.isArray(paths)) {
        return null;
    }

    if (paths[0] === 'export') {
        paths.shift();
    }

    return paths;
}
