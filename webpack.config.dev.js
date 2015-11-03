var webpack = require('webpack');
var path = require('path');

module.exports = {
  devtool: 'eval',
  entry: [ // webpack/hot/only-dev-server
    'webpack-dev-server/client?http://localhost:8081',
    'webpack/hot/only-dev-server',
    './src/client/entry',
  ],
  output: {
    path: path.join(__dirname, '/public/js/'),
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
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch' // What is this for?
    })
  ],
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [
      { test: /\.js?$/, loaders: ['react-hot', 'babel?optional[]=runtime&stage=0'], exclude: /node_modules/ },
      { test: /\.css$/, loader: "style-loader!css-loader?sourceMap" },
      { test: /\.less$/, loader: "style-loader!css-loader!less-loader" },
      { test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
      { test: /\.json$/, loader: "json-loader" }
    ]
  }
  //postcss: [autoPrefixer()]
}
