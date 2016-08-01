var path = require("path");
var webpack = require('webpack');
module.exports = {
	entry: {
		app: [
			// 'webpack-dev-server/client?http://localhost:3001',
			// 'webpack/hot/only-dev-server',
			"./public/javascripts/main.js"
		]

	},
	output: {
		path: path.join(__dirname, "public","build"),
		publicPath: "http://localhost:3001/build/",
		// publicPath: "/build/",
		filename: "bundle.js"
	},
	module: {
		loaders: [{
			test: /\.jsx?$/,
			include: path.join(__dirname,"public","javascripts"),
			loaders: ["react-hot-loader", "babel-loader"]
		}]
	}
	// ,plugins: [
	// 	new webpack.HotModuleReplacementPlugin()
	// ]


};