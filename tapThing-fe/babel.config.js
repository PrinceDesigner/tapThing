// babel.config.js
module.exports = function (api) {
  api.cache(true);

  const isProd = process.env.NODE_ENV === 'production';

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Alias
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
          },
        },
      ],

      // Paper va PRIMA di Reanimated
      ...(isProd ? ['react-native-paper/babel'] : []),

      // Deve essere SEMPRE l'ultimo
      'react-native-reanimated/plugin',
    ],
  };
};
