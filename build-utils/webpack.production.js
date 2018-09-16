const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = () => ({
	optimization: {
		splitChunks: {
			cacheGroups: {
				/*styles: {
					name: 'styles',
					test: /\.(s|)css$/,
					chunks: 'all',
					enforce: true
				},*/
				commons: {
          test: /[\\/]node_modules[\\/].+\.js$/,
          name: 'vendors',
          chunks: 'all'
        }
			}
		}
	},
	plugins: [
		new MiniCssExtractPlugin()
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, "css-loader"]
			},
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader, 
					{
						loader: "css-loader",
						options: {
							importLoaders: 2,
						}
					},
					{
						loader: 'resolve-url-loader',
					},
					{
						loader: "sass-loader",
						options: {
							sourceMap: true,
							sourceMapContents: false
						}
					}
				],
			},
		]
	}
});