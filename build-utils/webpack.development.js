var path = require('path');

module.exports = () => ({
	devtool: 'inline-source-map',
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		hot: true
	},
	module: {
		rules: [{
				test: /\.css$/,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: {
							sourceMap: true
						}
					}
				]
			},
			{
				test: /\.scss$/,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: {
							importLoaders: 2,
							sourceMap: true
						}
					},
					{
						loader: 'resolve-url-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: "sass-loader",
						options: {
							sourceMap: true
						}
					}
				],
			},
		]
	}
});