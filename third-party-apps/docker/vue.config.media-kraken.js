/* eslint-disable @typescript-eslint/no-var-requires */
const WorkerPlugin = require('worker-plugin');
const path = require('path');

const version = require('./package.json').version;

const isProduction = process.env.NODE_ENV === 'production';
const isTesting = process.env.NODE_ENV === 'testing';

/**
 * Commit hash strategy:
 * - Prefer injected env var (Docker / CI)
 * - Fallback to 'unknown'
 */
const sourceCommitHash = process.env.VUE_APP_COMMIT_HASH || 'unknown';

const versionName =
    'v' + version + (isProduction ? '' : `-next-${sourceCommitHash}`);

const publicPath = isProduction ? '/media-kraken/' : '/';

const title = 'Media Kraken';
const description = 'Track your movies with Media Kraken and never miss a beat!';
const baseUrl = isProduction
    ? 'https://noeldemartin.github.io/media-kraken/'
    : 'http://localhost:8080';

const sourceUrl = 'https://github.com/noeldemartin/media-kraken';

const releaseNotesUrl = isProduction
    ? `${sourceUrl}/releases/tag/${versionName}`
    : `${sourceUrl}/tree/${sourceCommitHash}`;

process.env.VUE_APP_VERSION = version;
process.env.VUE_APP_VERSION_NAME = versionName;
process.env.VUE_APP_SOURCE_URL = sourceUrl;
process.env.VUE_APP_RELEASE_NOTES_URL = releaseNotesUrl;
process.env.VUE_APP_PUBLIC_PATH = publicPath;

module.exports = {
    publicPath,

    pages: {
        index: {
            title,
            description,
            baseUrl,
            version: versionName,
            entry: isTesting ? 'src/index.testing.ts' : 'src/index.ts',
        },
        '404': {
            title,
            baseUrl,
            version: versionName,
            entry: 'src/routing/github-404.ts',
            chunks: [],
        },
        viewer: {
            title: `${title} Viewer`,
            description,
            baseUrl,
            version: versionName,
            entry: 'src/viewer/index.ts',
            template: 'public/index.html',
        },
    },

    configureWebpack: {
        devtool: 'source-map',
        externals: {
            'node-fetch': 'fetch',
            'text-encoding': 'TextEncoder',
            'whatwg-url': 'window',
            'isomorphic-fetch': 'fetch',
            '@trust/webcrypto': 'crypto',
        },
        resolve: {
            alias: process.env.NODE_ENV !== 'production'
                ? {
                    soukai: path.resolve('./node_modules/soukai'),
                }
                : {},
        },
        plugins: [
            new WorkerPlugin(),
        ],
    },

    chainWebpack: (config) => {
        if (process.env.NODE_ENV !== 'production') {
            config.resolve.symlinks(false);
        }

        const svgRule = config.module.rule('svg');
        svgRule.uses.clear();
        svgRule
            .use('babel-loader')
            .loader('babel-loader')
            .end()
            .use('vue-svg-loader')
            .loader('vue-svg-loader');

        config.plugins.delete('fork-ts-checker');

        config.module
            .rule('markdown')
            .test(/\.md$/)
            .use('raw-loader')
            .loader('raw-loader');

        config.plugins.delete('prefetch-404');
        config.plugins.delete('preload-404');
    },

    pwa: {
        name: title,
        themeColor: '#fed7d7',
        msTileColor: '#fed7d7',
        manifestOptions: {
            background_color: '#ffffff',
            orientation: 'portrait',
            version,
        },
        workboxOptions: {
            importWorkboxFrom: 'local',
            exclude: [
                /\.map$/,
                /img\/icons\//,
                /favicon\.ico$/,
                /^manifest.*\.js?$/,
                /index\.html/,
            ],
            runtimeCaching: [
                {
                    urlPattern: /^https:\/\/noeldemartin\.github\.io\/media-kraken\/$/,
                    handler: 'NetworkFirst',
                },
                {
                    urlPattern: /^https:\/\/noeldemartin\.github\.io\/media-kraken\/.*/,
                    handler: 'CacheFirst',
                },
            ],
        },
    },
};
