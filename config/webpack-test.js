var webpack = require('webpack');
var webpackMerge = require('webpack-merge');

var helpers = require('./helpers');
var webpackCommon = require('./webpack-common');

webpackCommon.tsconfig = helpers.root('tsconfig-dist.json');

module.exports = webpackMerge(
	webpackCommon.angularWorkaround,
	webpackCommon.defaultDefinePlugin,
	webpackCommon.resolve,
	webpackCommon.common,
	{

		context: helpers.root('src'),

		devtool: 'inline-source-map'

	}
);
