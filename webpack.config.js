/**
 * Created by andre on 10.12.15.
 */

var webpack = require('webpack');
var path = require('path');

const BUILD_DIR = 'build';
const PATHS = {
    src: path.join(__dirname, 'src'),
    build: path.join(__dirname, BUILD_DIR)
};

module.exports = {
    entry: './src/main.js',
    output: {
        path: PATHS.build,
        // public path is prefixed to generated ressource uri's i.e. image url's
        // set it to reflect ressources location in deployed state
        // dev server will also reflect this
        publicPath: 'build/',
        filename: 'build.js'
    },
    module: {
        loaders: [
            // load used images. this will also copy used images in dist directory on build
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file?name=[name].[ext]?[hash]'
            },
            // load .vue combined files, automatically extract css, template and convert from ES6 usinf submodules
            { test: /\.vue$/, loader: 'vue' },
            // used to parse hson files which store our configuration
            { test: /\.hson$/, loader: 'hson' }
        ]
    }
};

if (process.env.NODE_ENV === 'production') {
    var ExtractTextPlugin = require("extract-text-webpack-plugin");

    module.exports.plugins = [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        // for production systems create standalone css file
        new ExtractTextPlugin("[name].css")
    ];

    // for production systems create standalone css file
    module.exports.vue = {
        loaders: {
            css: ExtractTextPlugin.extract("css"),
            stylus: ExtractTextPlugin.extract("css!stylus")
        }
    };
} else {
    // apply source mapping in dev mode
    // works also with .vue files
    module.exports.devtool = '#source-map'
}