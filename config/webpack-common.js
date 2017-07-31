var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');

var helpers = require('./helpers');

var webpackCommon = {
	extractStyles: {
		demo: new ExtractTextPlugin( 'bundles/demo.bundle.css?[contenthash]' ),
		vendor: new ExtractTextPlugin( 'bundles/vendor.bundle.css?[contenthash]' )
	},
	sourcePath: helpers.root('src'),
	tsconfig: helpers.root('tsconfig.json')
};

// demo
webpackCommon.common = {

	module: {
		rules: [

			// typescript
			{
				test: /\.ts$/,
				use: [
					{
						loader: 'awesome-typescript-loader',
						options: { configFileName: webpackCommon.tsconfig }
					}, 'angular2-template-loader'
				]
			},

			// html
			{
				test: /\.html$/,
				use: 'html-loader',
				exclude: /index\.html$/
			},

			// common scss
			{
				test: /\.scss$/,
				use: ['to-string-loader', 'css-loader', 'sass-loader'],
				include: /common\.scss$/
			},

			// component scss
			{
				test: /\.scss$/,
				use: ['to-string-loader', 'css-loader', 'sass-loader'],
				include: /\.component\.scss$/
			}

		]
	},

	plugins: [
		webpackCommon.extractStyles.demo,
		webpackCommon.extractStyles.vendor
	]

};

// angularWorkaround
webpackCommon.angularWorkaround = {

	plugins: [

		// Workaround for angular/angular#11580
		new webpack.ContextReplacementPlugin(
			// The (\\|\/) piece accounts for path separators in *nix and Windows
			/angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
			// location of src
			webpackCommon.sourcePath,
			// Angular Async Route paths relative to this root directory
			{ }
		),

		new webpack.ContextReplacementPlugin(
			// The (\\|\/) piece accounts for path separators in *nix and Windows
			/angular(\\|\/)core(\\|\/)@angular/,
			// location of src
			webpackCommon.sourcePath,
			// Angular Async Route paths relative to this root directory
			{ }
		)

	]

};

// defaultDefinePlugin
webpackCommon.defaultDefinePlugin = {

	plugins: [

		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify( process.env.NODE_ENV )
			}
		}),

	]

};

// imageLoader
webpackCommon.imageLoader = {

	module: {
		rules: [

			{
				// TODO: Replace when breaking change is fixed in repo https://github.com/imagemin/imagemin-svgo/issues/25
				// test: /\.(svg|png|jpe?g|gif)$/,
				test: /\.(xxx)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: (path) => loaderTarget('images', path)
						}
					},
					'img-loader'
				]
			},
			{
					// TODO: Replace when breaking change is fixed in repo https://github.com/imagemin/imagemin-svgo/issues/25
					// test: /\.(ico)$/,
					test: /\.(ico|svg|png|jpe?g|gif)$/,
					use: [
						{
							loader: 'file-loader',
							options: {
								name: (path) => loaderTarget('images', path)
							}
						}
					]
			},
			{
				test: /\.(woff|woff2|ttf|eot)$/,
				use: {
					loader: 'file-loader',
					options: {
						name: (path) => loaderTarget('fonts', path)
					}
				}
			}

		]
	}

};

// resolve
webpackCommon.resolve = {

	resolve: {
		extensions: ['.ts', '.js']
	}

};

module.exports = webpackCommon;

function loaderTarget(name, path) {
    if ( /node_modules/.test(path)) {
        return 'vendor/' + path
            .replace(/\\/g, '/')
            .replace(
                /((.*node_modules)|images|image|img|assets)\//g, ''
            ) + '?[hash]';
    }

    return name + '/[name].[ext]?[hash]';
}
