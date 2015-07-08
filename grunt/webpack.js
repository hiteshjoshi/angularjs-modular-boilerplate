'use strict';

module.exports = function (path, webpack) {
  return {
    src: {
      entry: {
        vendor: path.resolve(__dirname, '../src/modules/vendor.js'),
        app: path.resolve(__dirname, '../src/modules/app.js')
      },
      output: {
        path: path.resolve(__dirname, '../src/bundles/'),
        publicPath: 'bundles/',
        filename: '[name].js'
      },
      resolve: {
        alias: {
          'moduleDir':            path.resolve(__dirname, '../src/modules'),
          'componentDir':         path.resolve(__dirname, '../src/components'),
          'modernizr':            path.resolve(__dirname, '../bower_components/modernizr/modernizr'),
        },
        extensions: ['', '.js', '.json']
      },

      plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js')
      ],
      
      module: {
        loaders: [
          { test: /\.css$/, loader: 'style-loader!css-loader' },
          { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?prefix=font/&limit=5000&mimetype=application/font-woff' },
          { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader?prefix=font/' }
        ]
      }
    }
  };
};