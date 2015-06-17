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
          'bowerDir':             path.resolve(__dirname, '../bower_components'),
          'angular':              path.resolve(__dirname, '../bower_components/angular/angular'),
          'angularCookies':       path.resolve(__dirname, '../bower_components/angular-cookies/angular-cookies'),
          'angularAnimate':       path.resolve(__dirname, '../bower_components/angular-animate/angular-animate'),
          'angularSanitize':      path.resolve(__dirname, '../bower_components/angular-sanitize/angular-sanitize'),
          'angularTouch':         path.resolve(__dirname, '../bower_components/angular-touch/angular-touch'),
          'angularUiRouter':      path.resolve(__dirname, '../bower_components/angular-ui-router/release/angular-ui-router'),
          'underscore':           path.resolve(__dirname, '../bower_components/underscore/underscore'),
          'moment':               path.resolve(__dirname, '../bower_components/moment/moment'),
          'jquery':               path.resolve(__dirname, '../bower_components/jquery/dist/jquery')
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
    },
    docs: {
      entry: {
        vendor: path.resolve(__dirname, '../docs/scripts/vendor.js'),
        app: path.resolve(__dirname, '../docs/scripts/app.js')
      },
      output: {
        path: path.resolve(__dirname, '../docs/bundles/'),
        publicPath: 'bundles/',
        filename: '[name].js'
      },
      resolve: {
        alias: {
          'angular':              path.resolve(__dirname, '../bower_components/angular/angular'),
          'angularAnimate':       path.resolve(__dirname, '../bower_components/angular-animate/angular-animate'),
          'angularUiRouter':      path.resolve(__dirname, '../bower_components/angular-ui-router/release/angular-ui-router'),
          'jquery':               path.resolve(__dirname, '../bower_components/jquery/dist/jquery')
        }
      }
    }
  };
};