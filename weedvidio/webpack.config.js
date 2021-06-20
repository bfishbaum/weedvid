var path = require('path');
var HtmlWebpackPlugin =  require('html-webpack-plugin');
const { LoaderOptionsPlugin } = require('webpack');

module.exports = {
    entry : './client/index.js',
    output : {
        publicPath: '/',
        path : path.resolve(__dirname , 'dist'),
        filename: 'index_bundle.js'
    },
    module : {
        rules : [
            {
                test : /\.(jsx)$/, 
                loader:'babel-loader',
                exclude: '/node_modules/',
            },
            {test : /\.(js)$/, use:'babel-loader'},
            {test : /\.css$/, use:['style-loader', 'css-loader']}
        ]
    },
    mode:'production',
    plugins : [
        new HtmlWebpackPlugin ({
            template : './client/index.html'
        })
    ],
    devServer: {
        contentBase: './dist',
    }
};