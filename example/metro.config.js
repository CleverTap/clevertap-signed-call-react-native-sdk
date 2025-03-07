const path = require('path');
const escape = require('escape-string-regexp');
const { getDefaultConfig } = require('@react-native/metro-config');
const pak = require('../package.json');

const root = path.resolve(__dirname, '..');

const modules = Object.keys({
  ...pak.peerDependencies,
});

const defaultConfig = getDefaultConfig();

module.exports = {
  ...defaultConfig,
  projectRoot: __dirname,
  watchFolders: [root],

  resolver: {
    ...defaultConfig.resolver,
    blockList: modules.map(
      (m) =>
        new RegExp(`^${escape(path.join(root, 'node_modules', m))}\\/.*$`)
    ),

    nodeModulesPaths: [root],
    extraNodeModules: modules.reduce((acc, name) => {
      acc[name] = path.join(__dirname, 'node_modules', name);
      return acc;
    }, {}),
  },

  transformer: {
    ...defaultConfig.transformer,
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

