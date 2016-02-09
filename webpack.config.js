module.exports = {
  context: __dirname,
  entry: './src/client/index.js',
  output: {
    path: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      // { test: /\.css$/, loader: "style!css" }
      { loader: 'babel-loader', test: /\.js$/, include: /src/, exclude: /node_modules/}
    ]
  },
  devServer: {
    contentBase: './',

    // Trying to get hotloading to work.  Not quite there yet.
    //hot: true,
    //inline: true
    // also: need to enable special script in index.html
  },
  devtool: '#inline-source-map'
};