const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
            modifyVars: {
              '@primary-color': '#0079ff',
              dark: true, // 开启暗黑模式
              compact: true, // 开启紧凑模式
            },
          },
        },
      },
    },
  ],
};
