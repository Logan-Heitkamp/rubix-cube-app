const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure Metro properly resolves Windows paths
config.resolver.nodeModulesPaths = [
  require('path').resolve(__dirname, 'node_modules'),
  require('path').resolve(__dirname, '../node_modules'),
];

module.exports = config;
