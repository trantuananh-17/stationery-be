const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');
const { tsconfigAliases } = require('../../webpack.aliases');

module.exports = {
  resolve: {
    alias: tsconfigAliases,
  },
  output: {
    path: join(__dirname, '../../dist/apps/cart-service'),
    clean: true,
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
      sourceMap: true,
      assets: [
        './src/assets',
        {
          glob: '**/*',
          input: 'libs/interfaces/src/lib/proto/cart',
          output: './proto',
        },
        {
          glob: '**/*',
          input: 'libs/interfaces/src/lib/proto/product',
          output: './proto',
        },
      ],
    }),
  ],
};
