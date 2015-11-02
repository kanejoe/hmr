var webpack = require('webpack');
var path = require('path');

module.exports = {
  devtool: 'inline-source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:8081',
    //'webpack-hot-middleware/client?http://localhost:8081',  // need to try this out.
    'webpack/hot/only-dev-server',
    './src/client/entry',
  ],
  output: {
    path: __dirname + '/public/js/',
    filename: 'app.js',
    publicPath: 'http://localhost:8081/js/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development"),
        BROWSER: JSON.stringify(true)
      }
    }),
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    })
  ],
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [
      //{ test: /(\.js$)|(\.jsx$)/, exclude: /node_modules/, loader: 'babel-loader', query: { optional: ["es7.decorators", "es7.classProperties"] } },
      //{ test: /\.jsx?$/, loaders: ['react-hot', 'babel-loader?experimental'], exclude: /node_modules/ }, // this works
      { test: /\.jsx?$/, loaders: ['react-hot', 'babel?optional[]=runtime&stage=0'], exclude: /node_modules/ },
      { test: /\.css$/, loader: "style-loader!css-loader?sourceMap" },
      { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },
      //{ test: /\.(otf|eot|svg|ttf|woff)/, loader: 'url-loader?limit=10000' },
      { test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      //{ test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
      { test: /\.json$/, loader: "json-loader" }
    ]
  }
  //postcss: [autoPrefixer()]
}

// When inside Redux repo, prefer src to compiled version.
// You can safely delete these lines in your project.
var reduxSrc = path.join(__dirname, '..', '..', 'src');
var reduxNodeModules = path.join(__dirname, '..', '..', 'node_modules');
var fs = require('fs');
if (fs.existsSync(reduxSrc) && fs.existsSync(reduxNodeModules)) {
  // Resolve Redux to source
  module.exports.resolve = { alias: { 'redux': reduxSrc } };
  // Compile Redux from source
  module.exports.module.loaders.push({
    test: /\.js$/,
    loaders: ['babel'],
    include: reduxSrc
  });
}
