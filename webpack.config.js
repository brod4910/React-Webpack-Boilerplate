var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const isProd = process.argv.indexOf('-p') !== -1
var cssDev = ['style-loader', 'css-loader'];
var cssProd = ExtractTextPlugin.extract({
    fallback: "style-loader",
    use: "css-loader", //if using sass and css ['css-loader', 'sass-loader']
    publicPath: "/dist"
})

var cssConfig = isProd ? cssProd : cssDev;

module.exports = {
    entry: {
        app: './src/index.js',
        contact: './src/contact.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].bundle.js"
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        stats: "errors-only",
        hot: true,
        open: true
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssConfig
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    'file-loader?name=images/[hash:12].[ext]', //if you would hash name then use [name]
                    'image-webpack-loader'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            // minify: {
            //     collapseWhitespace: true
            // },
            hash: true,
            excludeChunks: ['contact'],
            template: './src/index.html',
        }),
        new HtmlWebpackPlugin({
            hash: true,
            chunks: ['contact'],
            filename: 'contact.html',
            template: './src/contact.html',
        }),
        new ExtractTextPlugin({
            filename: 'app.css',
            disable: !isProd,
            allChunks: true
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ]
}