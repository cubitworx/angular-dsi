var fs  = require('fs');
var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var helpers = require('./helpers');
var webpackCommon = require('./webpack-common.js');

const PACKAGE = JSON.parse( fs.readFileSync('./package.json').toString() );
const METADATA = {
	title: PACKAGE.name,
	description: PACKAGE.description,
	baseUrl: '/',
	isDevServer: helpers.isWebpackDevServer()
};

webpackCommon.sourcePath = helpers.root();

module.exports = webpackMerge(
	webpackCommon.angularWorkaround,
	webpackCommon.defaultDefinePlugin,
	webpackCommon.imageLoader,
	webpackCommon.resolve,
	webpackCommon.stylesExtracted,
	webpackCommon.common,
	{

		context: helpers.root(),

		devtool: 'cheap-module-eval-source-map',

    entry: {
			'bundles/polyfills': './demo/polyfills.ts',
			'bundles/demo': './demo/main.ts'
    },

    module: {
			rules: [

				// demo scss
				{
					test: /\.scss$/,
					use: webpackCommon.extractStyles.demo.extract({
							fallback: 'style-loader',
							use: [ 'css-loader', 'sass-loader' ]
					}),
					include: /demo(\\|\/)main\.scss$/
				},

				// vendor
				{
					test: /\.scss$/,
					use: webpackCommon.extractStyles.vendor.extract({
						fallback: 'style-loader',
						use: [ 'css-loader', 'sass-loader' ]
					}),
					include: /demo(\\|\/)vendor\.scss$/
				}

			]
		},

		output: {
			path: helpers.root('dev'),
			publicPath: '/',
			filename: '[name].bundle.js',
			chunkFilename: '[id].chunk.js'
		},

		plugins: [

			// Explicit polyfills chunk since they don't need to be imported via code
			new webpack.optimize.CommonsChunkPlugin({
					name: 'bundles/polyfills',
					chunks: ['bundles/polyfills']
			}),

			// Implicit common vendor chunk enables tree shaking of the vendor modules
			new webpack.optimize.CommonsChunkPlugin({
					name: 'bundles/vendor',
					chunks: ['bundles/demo'],
					minChunks: module => /node_modules/.test(module.resource)
			}),

			// Specify the correct order the scripts will be injected in
			new webpack.optimize.CommonsChunkPlugin({
				names: ['bundles/polyfills', 'bundles/vendor'].reverse()
			}),

			new HtmlWebpackPlugin({
				template: './demo/index.html',
				chunksSortMode: 'dependency',
				metadata: METADATA,
				inject: 'body'
			})

		],

		devServer: {
			historyApiFallback: true,
			stats: 'minimal'
		}

	}
);
