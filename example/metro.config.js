const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const exclusionList = require('metro-config/private/defaults/exclusionList').default;

const moduleRoot = path.resolve(__dirname, '..');

const config = {
  watchFolders: [moduleRoot],
  server: {
    port: 8083,
  },
  resolver: {
    extraNodeModules: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-native': path.resolve(__dirname, 'node_modules/react-native'),
      'react-native-netwatch': moduleRoot,
    },
    blockList: exclusionList([
      new RegExp(`${moduleRoot}/node_modules/react/.*`),
      new RegExp(`${moduleRoot}/node_modules/react-native/.*`),
    ]),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
