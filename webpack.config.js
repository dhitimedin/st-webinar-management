const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const CopyWebpackPlugin = require('copy-webpack-plugin'); // Import the copy-webpack-plugin

module.exports = {
    ...defaultConfig,
    entry: {
        'main': './src/js/main.js',
        'main-checkout': './src/js/main-checkout.js',
       /*  'index.umd': './src/js/index.umd.js', */
        'blocks/calendar': './src/js/blocks/calendar.jsx',
        'admin/main': './src/js/admin/main.js'
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
         new CopyWebpackPlugin({
            patterns: [
                {
                    from: './src/scss/dark/theme.css',
                    to: '../css/dark/theme.css',
                },
                {
                    from: './src/scss/default/theme.css',
                    to: '../css/default/theme.css',
                },
                {
                    from: './src/js/index.umd.js',
                    to: '../js/index.umd.js',
                },
                {
                    from: './src/scss/index.css',
                    to: '../css/index.css',
                },
                {
                    from: './src/scss/hotel-example.css',
                    to: '../css/hotel-example.css',
                },
            ],
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
