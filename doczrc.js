export default {
  src: './src/presentation/frontend',
  wrapper: 'src/presentation/frontend/ui/Reset',
  modifyBabelRc: () => {
    return {
      presets: [['babel-preset-react-app', {flow: true}]],
      plugins: [
        'react-hot-loader/babel',
        ['babel-plugin-react-docgen', {resolver: 'findAllExportedComponentDefinitions'}]
      ],
      cacheDirectory: true,
      babelrc: false
    };
  }
};
