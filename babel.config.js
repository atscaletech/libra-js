module.exports = {
  env: {
    test: {
      plugins: ['@babel/plugin-transform-modules-commonjs', '@babel/plugin-syntax-import-assertions'],
    },
  },
};
