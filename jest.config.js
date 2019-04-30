module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/lib/', '/demo/'],
  globals: {
    'ts-jest': {
      tsConfig: {
        module: 'ESNext',
        jsx: 'preserve'
      },
      babelConfig: {
        plugins: [
          'babel-plugin-macros',
          '@babel/plugin-transform-modules-commonjs',
          '@babel/plugin-transform-react-jsx'
        ]
      }
    }
  }
};
