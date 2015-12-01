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
          'jquery':               path.resolve(__dirname, '../bower_components/jquery/dist/jquery'),
          'modernizr':            path.resolve(__dirname, '../bower_components/modernizr/modernizr'),
          'angular-foundation':   path.resolve(__dirname, '../bower_components/angular-foundation/mm-foundation-tpls'),
          'layer-slider':   path.resolve(__dirname, '../bower_components/layer-slider/slider'),
          'foundation':   path.resolve(__dirname, '../bower_components/foundation/js/foundation/foundation'),
          'angular-parallax':   path.resolve(__dirname, '../bower_components/angular-parallax/scripts/angular-parallax'),
          'angularBase64':        path.resolve(__dirname, '../bower_components/angular-base64/angular-base64'),
          'angular-permission' : path.resolve(__dirname,'../bower_components/angular-permission/dist/angular-permission'),
          'ng-lodash' : path.resolve(__dirname,'../bower_components/ng-lodash/build/ng-lodash'),
          'angular-moment' : path.resolve(__dirname,'../bower_components/angular-moment/angular-moment'),
          'datetimepicker' : path.resolve(__dirname,'../bower_components/datetimepicker/jquery.datetimepicker'),
          'ng-tags-input' : path.resolve(__dirname,'../bower_components/ng-tags-input/ng-tags-input'),
          'select2':              path.resolve(__dirname, '../bower_components/select2/dist/js/select2'),
          'tinymce-dist':              path.resolve(__dirname, '../bower_components/tinymce-dist/tinymce'),
          'angular-ui-select2':              path.resolve(__dirname, '../bower_components/angular-ui-select2/src/select2'),
          'angular-ui-tinymce':              path.resolve(__dirname, '../bower_components/angular-ui-tinymce/src/tinymce')
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
