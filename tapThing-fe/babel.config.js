module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': './src',
            '@components': './src/components',
            '@theme': './src/theme',
            '@screens': './src/screens',
            '@navigation': './src/navigation',
            '@assets': './src/assets',
            '@hooks': './src/hooks',
            '@providers': './src/providers',
            '@locales': './src/locales',
            '@context': './src/context',
            '@store': './src/store',
            '@libs': './src/libs',
            '@utils': './src/utils',
            '@config': './src/config',
            '@api': './src/api',
            // aggiungi qui eventuali altri alias
          },
        },
      ],
    ],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
  };
};
