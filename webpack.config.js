const webpack = require("webpack");
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpackMerge = require("webpack-merge");
const CleanWebpackPlugin = require('clean-webpack-plugin');

const modeConfig = env => require(`./build-utils/webpack.${env}`)(env);

module.exports = ({
	mode,
	presets
} = {
	mode: "production",
	presets: []
}) => {
	return webpackMerge({
			mode,
			entry: {
				main: './src/js/index.js'
			},
			output: {
				filename: "bundle.js",
				path: path.resolve(__dirname, 'dist'),
				publicPath: 'http://127.0.0.1:8080/'
			},
			module: {
				rules: [{
						test: /\.js$/,
						exclude: /(node_modules|bower_components)/,
						use: {
							loader: 'babel-loader',
							options: {
								presets: ['@babel/preset-env']
							}
						}
					},
					{
						test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
						use: [{
							loader: "url-loader",
							options: {
								limit: 8192,
								outputPath: 'assets/'
							}
						}]
					},
					/*{
						test: /\.html$/,
						use: [
							{
								loader: "file-loader",
								options: {
                  name: '[path][name].[ext]'
								}
							}
						]
					},*/
					{
						test: /\.html$/,
						use: [{
								loader: "file-loader",
								options: {
									name: '[name].[ext]'
								}
							},
							"extract-loader",
							{
								loader: "html-loader",
								options: {
									attrs: ["img:src"]
								}
							}
						]
					}
				]
			},
			plugins: [
				new CleanWebpackPlugin(['dist']),
				new webpack.ProgressPlugin(),
				new webpack.ProvidePlugin({
					$: 'jquery',
					jQuery: 'jquery'
				})
				/*, new HtmlWebpackPlugin(),*/
			]
		},
		modeConfig(mode)
	);
};