  
const path = require('path');

const conf = {
  entry: './src/App.js',
  output: {
    path: path.resolve(__dirname, './public'),
    filename: 'app.js',
    publicPath: '/public',
  },
  devServer: {
    overlay: true,
  },
};

module.exports = (env, options) => {
    const production = options.mode === 'development';
  
    conf.devtool = production ? 'sourcemap' : 'eval-sourcemap';
  
    return conf;
  };