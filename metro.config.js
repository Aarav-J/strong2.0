const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add csv to asset extensions
config.resolver.assetExts.push('csv');

module.exports = config;