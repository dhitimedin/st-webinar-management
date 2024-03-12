const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const CopyWebpackPlugin = require('copy-webpack-plugin'); // Import the copy-webpack-plugin

module.exports = {
    ...defaultConfig,
    entry: {
        'webinar': './src/js/block-editor-script.jsx'
    },

    output: {
        path: path.resolve(__dirname, './assets/js'),
        filename: '[name].min.js',
        publicPath: '../../',
        assetModuleFilename: 'images/[name][ext][query]',
        clean: true,
    },

    devtool: "source-map",

    resolve: {
        extensions: ['.js', '.jsx'],
        fallback: {
            path: require.resolve('path'),
        },
    },

    module: {
        ...defaultConfig.module,
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
 				test: /\.(css|scss)$/,
				exclude: /node_modules/,
				use: [
					'style-loader',
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							esModule: false,
						},
					},
					{
						loader: 'css-loader',
					},
					'sass-loader',
				],
            },
            {
                test: /\.svg/,
                type: 'asset/inline',
            },
            {
                test: /\.(png|jpg|gif)$/,
                type: 'asset/resource',
                generator: {
                    filename: '../images/[name][ext][query]',
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                type: 'asset/resource',
                generator: {
                    filename: '../fonts/[name][ext][query]',
                },
            },
        ],
    },

    plugins: [
        ...defaultConfig.plugins,
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '../css/[name].min.css',
        }),
    ],

    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
        ],
    },
};
