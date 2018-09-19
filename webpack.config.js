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
				scripts: './src/js/scripts.js',
				main: './src/js/main.js',
				vendor: './src/js/vendor.js'
			},
			output: {
				filename: "[name].[contenthash].js",
				path: path.resolve(__dirname, 'dist'),
				publicPath: path.resolve(__dirname, 'dist') + '/' //path.resolve(__dirname, 'dist') + '/' //'http://127.0.0.1:8080/'
			},
			module: {
				rules: [{
						test: /\.js$/,
						exclude: /(node_modules|bower_components)/,
						use: {
							loader: 'babel-loader',
							options: {
								cacheDirectory: true,
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
								outputPath: 'assets/',
								name: '[name].[ext]'
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
					},
					*/
					/*
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
					*/
				]
			},
			plugins: [
				//new CleanWebpackPlugin(['dist']),
				new webpack.HashedModuleIdsPlugin(),
				new webpack.ProgressPlugin(),
				new webpack.ProvidePlugin({
					$: 'jquery',
					jQuery: 'jquery',
					jRespond: 'jrespond'
				}), new HtmlWebpackPlugin({
					title: 'Siren',
					template: 'html-loader?attrs[]=img:src!./src/index.html'
				})
			]
		},
		modeConfig(mode)
	);
};